# User-defined actions

If the [available plugins](external-actions.md) aren't enough, you can write
your own custom actions in the JavaScript dialect of your choice.

## Example 1: Hello world

Let's start by building the simplest possible action first: A "hello-world"
action that prints the text "hello world" in the test runner's console output
when running. Inside a Markdown document we will trigger it like this:

<a type="workspace/new-file">

```html
<a type="hello-world"></a>
```

Create a file **hello.md** with this content to test it.

</a>

When TextRunner encounters this region of type `hello-world`, it reads the file
<a type="workspace/new-file">**text-runner/hello-world.js** and runs the
function exported by it. Let's create this file with the content:

```javascript
export default action => {
  action.log("Hello world!!")
}
```

</a>

Let's run Text-Runner:

<pre type="shell/command">
text-runner
</pre>

The formatter displays test progress on the console as the test runs:

<pre type="shell/command-output">
Hello world!!
hello.md:1 -- Hello world
</pre>

## How it works

An action is a simple JavaScript or TypeScript function. It receives an object
containing information and utility functions:

<a type="all-action-args" ignore="linkTargets">

- **location** location of the currently executed region in the documentation
  (file and line)
- **region:** the document content inside the active region for this action
- **document:** the [content](#accessing-document-content) of the entire
  document that contains this action
- **configuration:** TextRunner configuration data
- **log:** a function similar to `console.log` that outputs text to the person
  running the test
- **name:** call this function to provide a human-readable name for this action
- **SKIPPING:** return this value if you have decided to skip the current action

</a>

TextRunner supports all forms of JavaScript functions as actions:

- synchronous functions
- functions receiving a callback
- functions returning a Promise
- [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

Examples for custom actions written in ESM are
[here](../examples/custom-action-esm/text-runner/hello-world.js). You can write
functions in [TypeScript](../examples/custom-action-typescript/) or in classic
[CommonJS](../examples/custom-action-commonjs/text-runner/hello-world.js). Throw
an exception to fail a test. Use only
[strippable types](https://nodejs.org/en/learn/typescript/run-natively).

## Accessing document content

The <code type="action-arg">region</code> attribute contains the document
content inside the currently active region. It is a flat array of syntax tree
nodes that provides helper methods to extract document content:

<a type="ast-node-list-methods" ignore="pushNode">

- **text():** returns the entire textual content in the current active region
- **textInNodeOfType(type1, type2, ...):** returns the text in the AST node of
  the given types. You can provide multiple alternative node types. Verifies
  that only one matching AST node exists.
- **textInNodeOfTypes(type1, type2, ...):** returns the text in the AST nodes of
  the given types. You can provide multiple alternative node types. Only one
  node is allowed to match.
- **textInNodesOfType(type):** provides the text in all nodes with the given
  type
- **nodeOfTypes(type1, type2, ...):** provides exactly one syntax node matching
  any of the given types
- **nodesFor(node):** provides a list of nodes from the given opening node to
  its closing counterpart
- **nodesOfTypes(type1, type2, ...):** provides the syntax nodes with any of the
  given types
- **hasNodeOfType(type):** indicates whether a syntax node with the given type
  exists
- **nodeTypes():** provides the names of all node types in this document region
- **textInNode():** providess the textual content for all nodes from the given
  opening node to its closing counterpart

</a>

To see the node types run `text-runner debug --ast <filename>` You can also
iterate <code type="action-arg">region</code> manually. Each element has these
attributes:

<a type="ast-node-attributes">

- **location:** the file and line in the file at which this AST node begins
- **type:** the type of the AST node. Examples are `text` for normal text,
  `code` for inline code blocks, `fence` for multi-line code blocks,
  `emphasized` for italic text, `strong` for bold text, and `link_open` for
  links.
- **tag:** corresponding HTML tag
- **content:** textual content of the AST node
- **attributes:** list of HTML attributes of the node

</a>

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
**text-runner/console-command.ts** (we are using TypeScript this time):

```typescript
import * as child_process from "child_process"
import * as textRunner from "text-runner"

export function consoleCommand(action: textRunner.actions.Args) {
  // determine the console command to run
  const commandToRun = action.region.text()

  // run the console command
  const result = child_process.execSync(commandToRun, { encoding: "utf8" })

  // print the output to the user
  action.log(result)
}
```

</a>

<a type="extension/run-textrunner"></a>

You can access other attributes on the HTML nodes like so:

```javascript
const attr = action.region[0].attributes
```

## Cleaning up unused activities

To see all custom activities that aren't currenly used, run:

<pre type="textrunner-command">
text-runner unused
</pre>

<hr>

Read more about:

- the [built-in actions](built-in-actions.md)
