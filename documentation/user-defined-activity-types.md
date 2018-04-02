# User-defined actions

It is possible to extend the set of
[built-in activity types](built-in-activity-types)
with your custom-built ones written in JavaScript.
Let's start by building the simplest possible action first.


## Hello-world example

The "hello-world" action prints the text "hello world"
in the test runner's console output when running.
It will be triggered via this piece of Markdown:

<a textrun="create-markdown-file">

```html
<a textrun="hello-world"></a>
```
</a>

When TextRunner encounters this block type,
it runs the method that the file <a textrun="create-file">__text-run/hello-world.js__ exports.
All user-defined actions are in the "text-run" folder,
with the file name matching the action name
but in [kebab-case](http://wiki.c2.com/?KebabCase).
Let's create this file with the content:

```javascript
module.exports = function({ formatter }) {
  formatter.output('Hello world!')        // print something on the console
};
```

</a>

<a textrun="run-textrun">
The formatter displays test progress on the console as the test runs:
</a>

The handler function for our action is given an object containing various information and utility functions:

<a textrun="verify-handler-args">

* __filename__, __line:__ location of the currently executed block in the documentation
* __nodes:__ the document content inside the `<a>` tag for this action,
  as an array of [AST nodes](#ast-nodes)
* __searcher:__ a utility that makes it easier to get content out of those AST nodes ([documentation](#the-searcher-helper))
* __formatter:__ the [Formatter](#formatter) instance to use, for signaling test progress and console output to TextRunner
* __configuration:__ TextRunner configuration data (which TextRunner options are enabled)
* __runner:__ the currently running handler function
</a>

TextRunner supports all forms of synchronous and asynchronous operations:
* just do something synchronous ([example](examples/custom-action-sync/text-run/hello-world.js)) -
  don't worry that synchronous operations prevent concurrency by blocking Node's event loop,
  all TextRunner blocks are tested strictly sequentially anyways
* return a Promise ([example](examples/custom-action-promise/text-run/hello-world.js))
* implement the action as a modern
  [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
  ([example](examples/custom-action-async/text-run/hello-world.js))
* take a callback function as a second parameter to your handler function and call it when you are done
  ([example](examples/custom-action-callback/text-run/hello-world.js))

You can write the handler in any language that transpiles to JavaScript,
for example [BabelJS](https://babeljs.io),
[CoffeeScript](http://coffeescript.org),
or [LiveScript](http://livescript.net).
Just make sure that your project contains a local installation of your transpiler,
since TextRunner does not find globally installed transpilers.
This means your project should have a `package.json` file listing the transpiler you want TextRunner to call,
in addition to any other NPM modules that your handler method uses.


## AST Nodes

Document content is provided as [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) nodes.
Each node is an object that has these attributes:
* __line:__ the line in the file at which this AST node begins
* __type:__ the type of the AST node. Examples are
            `text` for normal text,
            `code` for inline code blocks,
            `fence` for multi-line code blocks,
            `emphasizedtext` for italic text,
            `strongtext` for bold text,
            and `link_open` for links.
* __content:__ textual content of the AST node
* __src:__ the content of the `src` attribute if this AST node is a link or image
* __level:__ if this AST node was nested in another one, the nesting level


## Formatter

One of the utilities availabe to actions is the formatter instance.
It allows to signal test progress to TextRunner and print test output to the console
and provides the following methods:

* __output(text):__
  allows to print output of the currently running action to the console -
  depending on the type of formatter, this output is printed or not
* __stdout__ and __stderr:__
  streams that you can pipe output of commands you run into
* __console:__
  a console object that you should use instead of the built-in console
  to generate output that fits into the formatter output
* __warn:__ to signal a warning to the user (but keep the test passing)
* __skip:__ to skip the current test
* __setTitle:__ overrides how the current activity is called in the test output


TextRunner supports a variety of formatters:

* __detailed formatter:__
  Prints each test performed, including test output.

* __dot formatter:__
  A minimalistic formatter, shows only dots for each test performed.


## The "searcher" helper

More realistic tests for your documentation
will need to access document content
in order to use it in tests.
The DOM nodes of the active block
including their type, content, and line number -
are provided to your handler function
via the the `nodes` field of the first argument.
You can access this data directly
or use a helper that is provided to you via the `searcher` field of the first parameter.
To demonstrate how this works,
here is a simple implementation of an action that runs a code block in the terminal.

<a textrun="create-markdown-file">

```
<a textrun="console-command">
`​``
echo "Hello world"
`​``
</a>
```
</a>

Here is the block definition implemented using the `searcher` helper,
as always implemented in a file called
<a textrun="create-file">
__text-run/console-command.js__:

```javascript
child_process = require('child_process')

module.exports = function({formatter, searcher, nodes}) {

  // determine which command to run using the searcher utility
  // (you could also iterate the "nodes" array directly here)
  const commandToRun = searcher.tagContent('fence')

  // perform the action
  formatter.output(child_process.execSync(commandToRun, {encoding: 'utf8'}))
}
```
</a>

<a textrun="run-textrun"></a>

<a textrun="verify-searcher-methods">
The `searcher` tool provides the following properties and methods:
* __tagContent:__ returns the textual content of the DOM node
  that satisfies the given query.
  In the example above we are looking for a fenced code block,
  hence the query is `'fence'`.
  Providing an array for the type (e.g. `['code', 'fence']}`)
  retrieves all nodes that have any of the given types.

  This method throws if it finds more or less than one tag of the given type
  in the active block. Other tag types are ignored.

  The optional second argument allows you to provide a default value
  in case no matching tag is found, e.g. `{default: ''}`.
* __tagsContents:__ returns the textual content of multiple DOM nodes
* __findNode:__ returns the DOM node matching the query,
  throws if more than one node is found
* __findNodes:__ returns the DOM nodes matching the query
* __nodes:__ property containing the DOM nodes for this active block
</a>

<hr>

Read more about:
- the [built-in activity types](built-in-activity-types)
- [configure](configuration.md) TextRunner
