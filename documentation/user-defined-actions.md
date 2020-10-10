# User-defined actions

If the [built-in actions](built-in-actions.md) and
[available plugins](external-actions.md) aren't enough, you can write your own
custom actions in JavaScript.

## Example 1: Hello world

Let's start by building the simplest possible action first: A "hello-world"
action that prints the text "hello world" in the test runner's console output
when running. Inside our Markdown document we trigger it like this:

<a type="workspace/new-file">

```html
<a type="hello-world"></a>
```

Create a file **hello.md** with this content to test it.

</a>

When TextRunner encounters this region of type `hello-world`, it runs the method
that the file <a type="workspace/new-file">**text-run/hello-world.js** exports.
All user-defined actions are in the "text-run" folder, with the file name
matching the action name but in [kebab-case](http://wiki.c2.com/?KebabCase).
Let's create this file with the content:

```javascript
module.exports = function (action) {
  action.log("Hello world!!")
}
```

</a>

Let's run Text-Runner:

<pre type="shell/command">
$ text-run
</pre>

The formatter displays test progress on the console as the test runs:

<pre type="shell/command-output">
Hello world!!
hello.md:1 -- Hello world
</pre>

## Action functions

Actions are simple JavaScript functions. An action receives an object containing
various information and utility functions:

<a type="verify-action-args" ignore="linkTargets">

- **location** location of the currently executed region in the documentation
- **region:** the [document content](#accessing-document-content) inside the
  active region for this action,
- **document:** the [content](#accessing-document-content) of the entire
  document that contains this action,
- **configuration:** TextRunner configuration data
- **log:** call this function to output text to the user running your test
- **name:** call this function to refine the name of the current test step
- **SKIPPING:** return this value if you have decided to skip the current action

</a>

TextRunner supports all forms of JavaScript functions:

- synchronous functions
- functions receiving a callback
- functions returning a Promise
- [async
  functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

Examples are [here](../examples/custom-action/text-run/hello-world.js)

You can write functions in any of the languages that
[interpret](https://github.com/gulpjs/interpret) supports. Here are examples
for:

- [TypeScript](../examples/custom-action-typescript/)
- [CoffeeScript](../examples/custom-action-coffeescript/)

## Accessing document content

The `nodes` attribute contains the document content inside the currently active
region. It is an array of AST nodes that provides helper methods to extract
document content:

<!-- TODO: ensure completeness of this -->

- **text():** returns the entire textual content in the current active region
- **textInNodeOfType(type1, type2, ...):** returns the text in the AST node of
  the given types. You can provide multiple alternative node types. Verifies
  that only one matching AST node exists.
- **textInNodeOfTypes(type1, type2, ...):** returns the text in the AST nodes of
  the given types. You can provide multiple alternative node types.

You can also iterate `nodes` manually. Each node has these attributes:
<a type="verify-ast-node-attributes">

- **location:** the file and line in the file at which this AST node begins
- **type:** the type of the AST node. Examples are `text` for normal text,
  `code` for inline code blocks, `fence` for multi-line code blocks,
  `emphasized` for italic text, `strong` for bold text, and `link_open` for
  links.
- **tag:** corresponding HTML tag
- **content:** textual content of the AST node
- **attributes:** list of HTML attributes of the node </a>

## Example 2: accessing document content

Here is an example for an action that runs a code block in the terminal.
<a type="workspace/new-file"> Create a file **execute.md** with the content:

```
<pre type="console-command">
echo "Hello world"
</pre>
```

</a>

Here is the corresponding action, implemented in <a type="workspace/new-file">
**text-run/console-command.js**:

```javascript
child_process = require("child_process")

module.exports = function (action) {
  // determine which command to run
  // (you could also iterate the "nodes" array directly here)
  const commandToRun = action.region.text()

  // perform the action
  const result = child_process.execSync(commandToRun, { encoding: "utf8" })
  action.log(result)
}
```

</a>

<a type="extension/run-textrunner"></a>

## Formatters

One of the utilities availabe to actions is the formatter instance. It allows to
signal test progress to TextRunner and print test output to the console. It
provides the following methods:

<!-- TODO: verify completeness -->

- **log(text):** allows to print output of the currently running action to the
  console - depending on the type of formatter, this output is printed or not
- **warn:** to signal a warning to the user (but keep the test passing)
- **skip:** call this to skip the current test
- **name:** overrides how the current action is called in the test output
- **stdout** and **stderr:** streams that you can pipe output of commands you
  run into
- **console:** a console object that you should use instead of the built-in
  console to generate output that fits into the formatter output

To fail a test, throw an `Error` with the corresponding error message.
TextRunner supports a variety of formatters:

- **detailed formatter:** Prints each test performed, including test output.

- **dot formatter:** A minimalistic formatter, shows a dots for each test
  performed.

- **progress formatter:** Prints a progress bar

- **summary formatter:** Prints only a summary at the end

## Cleaning up unused activities

To see all custom activities that aren't currenly used, run:

<!-- TODO: ensure this command exists -->

```
text-run unused
```

<hr>

Read more about:

- the [built-in actions](built-in-actions.md)
- [configure](configuration.md) TextRunner
