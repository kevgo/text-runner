# User-defined activities

It is possible to extend the set of
[built-in activity types](built-in-activity-types)
with your custom-built ones written in JavaScript.


## Hello-world example

Let's start by building the simplest possible action first:
A "hello-world" action that prints the text "hello world"
in the test runner's console output when running.
It will be triggered via this piece of Markdown:

<a textrun="create-file">

```html
<a textrun="hello-world"></a>
```

Create a file **hello.md** with this content to test it.

</a>

When TextRunner encounters this `hello-world` block type,
it runs the method that the file <a textrun="create-file">__text-run/hello-world.js__ exports.
All user-defined actions are in the "text-run" folder,
with the file name matching the action name
but in [kebab-case](http://wiki.c2.com/?KebabCase).
Let's create this file with the content:

```javascript
module.exports = function({ formatter }) {
  formatter.log('Hello world!')
};
```

</a>

<a textrun="run-textrun">
The formatter displays test progress on the console as the test runs:
</a>

<pre textrun="verify-console-command-output">
Hello world!
hello.md:1 -- Hello world
</pre>


## Handler functions

The handler function for our action is given an object containing various information and utility functions:

<a textrun="verify-handler-args">

* __file__, __line:__ location of the currently executed block in the documentation
* __nodes:__ the [document content](#accessing-document-content) inside the active block for this action,
* __formatter:__ the [Formatter](#formatter) instance to use, for signaling test progress and console output to TextRunner
* __configuration:__ TextRunner configuration data (which TextRunner options are enabled)
</a>

TextRunner supports all forms of synchronous and asynchronous operations:
* just do something synchronous ([example](examples/custom-action-sync/text-run/hello-world.js))
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


## Accessing document content

Document content is provided in the `nodes` attribute.
It contains an [AstNodeList](/src/parsers/ast-node-list.js).
This is an Array subclass containing [AstNodes](/src/parsers/ast-node.js)
from the current active block in the document
with additional helper methods to extract document content:

* __text():__ returns the entire textual content in the current active block
* __textInNodeOfType(type1, type2, ...):__
    returns the text in the AST node of the given types.
    You can provide multiple alternative node types.
    Verifies that only one matching AST node exists.
* __textInNodeOfTypes(type1, type2, ...):__
    returns the text in the AST nodes of the given types.
    You can provide multiple alternative node types.

You cant also iterate `nodes` manually.
Each node has these attributes:
<a textrun="verify-ast-node-attributes">
* __file__, __line:__ the file and line in the file at which this AST node begins
* __type:__ the type of the AST node. Examples are
            `text` for normal text,
            `code` for inline code blocks,
            `fence` for multi-line code blocks,
            `emphasized` for italic text,
            `strong` for bold text,
            and `link_open` for links.
* __tag:__ corresponding HTML tag
* __content:__ textual content of the AST node
* __attributes:__ list of HTML attributes of the node
</a>

Here is an example for an action that runs a code block in the terminal.
<a textrun="create-file">
Create a file __execute.md__ with the content:

```
<pre textrun="console-command">
echo "Hello world"
</pre>
```
</a>

Here is the corresponding action, implemented in
<a textrun="create-file">
__text-run/console-command.js__:

```javascript
child_process = require('child_process')

module.exports = function({formatter, nodes}) {

  // determine which command to run
  // (you could also iterate the "nodes" array directly here)
  const commandToRun = nodes.text()

  // perform the action
  formatter.log(child_process.execSync(commandToRun, {encoding: 'utf8'}))
}
```
</a>

<a textrun="run-textrun"></a>


## Formatter

One of the utilities availabe to actions is the formatter instance.
It allows to signal test progress to TextRunner and print test output to the console.
It provides the following methods:

* __log(text):__
  allows to print output of the currently running action to the console -
  depending on the type of formatter, this output is printed or not
* __warn:__ to signal a warning to the user (but keep the test passing)
* __skip:__ call this to skip the current test
* __name:__ overrides how the current activity is called in the test output
* __stdout__ and __stderr:__
  streams that you can pipe output of commands you run into
* __console:__
  a console object that you should use instead of the built-in console
  to generate output that fits into the formatter output

To fail a test, throw an `Error` with the corresponding error message.
TextRunner supports a variety of formatters:

* __detailed formatter:__
  Prints each test performed, including test output.

* __dot formatter:__
  A minimalistic formatter, shows only dots for each test performed.


<hr>

Read more about:
- the [built-in activity types](built-in-activity-types)
- [configure](configuration.md) TextRunner
