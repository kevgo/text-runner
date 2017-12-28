# User-defined actions

It is possible to extend the set of [built-in actions](built-in-actions.md)
with your custom-built ones written in JavaScript.
Let's start by building the simplest possible action first.


## Hello-world example

The "hello-world" action prints the text "hello world"
in the test runner's console output when running.
It will be triggered via this piece of Markdown:

<a class="tr_createMarkdownFile">

```html
<a class="tr_helloWorld"></a>
```
</a>

When TextRunner encounters this block type,
it runs the method that the file <a class="tr_createFile">__text-run/hello-world-action.js__ exports.
All user-defined actions are in the "text-run" folder,
with the file name matching the action name
but in [kebab-case](http://wiki.c2.com/?KebabCase).
Let's create this file with the content:

```javascript
module.exports = function({ formatter }) {
  formatter.start('greeting the world')   // start the "greeting the world" activity type
  formatter.output('Hello world!')        // print something on the console
  formatter.success()                     // finish the started activity
};
```

</a>

<a class="tr_runTextrun">
The formatter displays test progress on the console as the test runs:
</a>

<img src="async.gif" width="460" height="134" alt="output demonstration">

The handler function for our action is given an object containing various information and utility functions:

<!-- TODO: check this by creating a custom action that lists the arguments given to it -->
* __filename__, __startLine__, __endLine:__ location of the currently executed block in the documentation
* __nodes:__ the document content inside the `<a>` tag for this action,
  as an array of [AST nodes](#ast-nodes)
* __searcher:__ a utility that makes it easier to get content out of those AST nodes ([documentation](#the-searcher-helper))
* __formatter:__ the [Formatter](#formatter) instance to use, for signaling test progress and console output to TextRunner
* __configuration:__ TextRunner configuration data (which TextRunner options are enabled)
* __runner:__ the currently running handler function

TextRunner supports all forms of synchronous and asynchronous operations:
* just do something synchronous ([example](../examples/custom-action-sync)) -
  don't worry that synchronous operations prevent concurrency by blocking Node's event loop,
  all TextRunner steps are run strictly sequentially anyways
* return a Promise  <!-- TODO: example -->
* implement the action as a modern
  [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
  <!-- TODO: example -->
* take a callback function as a second parameter to your handler function and call it when you are done
  ([example](../examples/custom-action-async))

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
* __type:__ the type of the AST node
* __content:__ textual content of the AST node
* __src:__ the content of the `src` attribute if this AST node is a link or image
* __level:__ if this AST node was nested in another one, the nesting level


## Formatter

One of the utilities availabe to actions is the formatter instance.
It allows to signal test progress to TextRunner and print test output to the console.

Call `formatter.start(<activity name>)` before you run an activity.
This tells TextRunner that whatever happens next (output, success, failure) is part of that activity.

`formatter.output(text)` allows to print output of the currently running action
on the console. Depending on the type of formatter, this output is printed or not.

When the test succeeds, call `formatter.success()`.
If it fails, call `formatter.error()` with the error message.

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

<a class="tr_createMarkdownFile">

```
<a class="tr_consoleCommand">
`​``
echo "Hello world"
`​``
</a>
```
</a>

Here is the block definition implemented using the `searcher` helper,
as always implemented in a file called
<a class="tr_createFile">
__text-run/console-command.js__:

```javascript
child_process = require('child_process')

module.exports = function({formatter, searcher, nodes}) {

  // step 1: provide a first rough description of what this action does,
  // so that TextRunner can print a somewhat helpful error message
  // if loading more specific data below fails somehow
  formatter.start('running console command')

  // step 2: determine which command to run using the searcher utility
  // (you could also iterate the "nodes" array directly here but that's more cumbersome)
  const commandToRun = searcher.nodeContent({type: 'fence'}, function(match) {
    if (match.nodes.length === 0) return 'this block must contain a code block with the command to run'
    if (match.nodes.length > 1) return 'please provide only one code block'
    if (!match.content) return 'you provided a code block but it has no content'
  })

  // step 3: provide TextRunner a specific description of this action
  formatter.refine('running console command: ' + commandToRun)

  // step 4: perform the action
  formatter.output(child_process.execSync(commandToRun, {encoding: 'utf8'}))

  // step 5: tell TextRunner that this action worked and we are done here
  formatter.success()
}
```
</a>

<a class="tr_runTextrun"></a>

The `searcher.nodeContent` method returns the content of the DOM node
that satisfies the given query.
In this case we are looking for a fenced code block,
hence the query is `{type: 'fence'}`.
Providing an array for the type (e.g. `{type: ['code', 'fence']}`)
retrieves all nodes that have any of the given types.

The second parameter is an optional validation method.
Its purpose is to make it easy and readable to provide specific error messages
that make your custom block definition user-friendly and easy to debug.
Its parameter is an object containing the content of the determined node
as well as an array of all the nodes that match the given query.
Strings returned by this method get printed as errors to the user and cause the test to fail,
falsy return values indicate that the validation has passed,

<hr>

Read more about:
- the [built-in actions](built-in-actions.md)
- [configure](configuration.md) TextRunner
