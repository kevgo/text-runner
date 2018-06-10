# Run a command on the console

- runs the command given in the code block in the workspace
- waits for the command to finish before continuing the test
- a `$` at the beginning of the line is ignored
- you can [configure](#calling-global-commands) global binaries that you your code base exports
  so that your test can call them directly
- if you just want to verify that your Javascript has no syntax errors,
  use the [validateJavascript](validate_javascript.md) action instead

<a textrun="run-markdown-in-textrun">

```markdown
<a textrun="run-console-command">
`​``
$ echo "hello world"
`​``
</a>
```
</a>

You can enter text into the running command by providing an HTML table
with the content to enter.
Assuming we have a little application called
<a textrun="create-file">
__greeter.js__
```js
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Your name?', (name) => {
  rl.question('Current day of the week?', (weekday) => {
    console.log(`Hello ${name}, happy ${weekday}!`)
    process.exit()
  })
})
```
</a>

<a textrun="run-markdown-in-textrun">

```markdown
<a textrun="run-console-command">
`​``
$ node greeter.js
`​``
<table>
  <tr>
    <td>Mortimer</td>
  </tr>
  <tr>
    <td>Tuesday</td>
  </tr>
</table>

</a>
```
</a>

If the table contains multiple columns,
the first column contains output to wait for for,
and the last one text to enter once the output from the first column has appeared.
Middle columns are ignored.
`<th>` elements are considered descriptions and are also ignored.

<a textrun="run-markdown-in-textrun">

```markdown
<a textrun="run-console-command">
`​``
$ node greeter.js
`​``
<table>
  <tr>
    <th>question</th>
    <th>description</th>
    <th>you enter</th>
  </tr>
  <tr>
    <td>Your name?</td>
    <td>the name of the person being greeted</td>
    <td>Mortimer</td>
  </tr>
  <tr>
    <td>Current day of the week?</td>
    <td>enter any day name here</td>
    <td>Tuesday</td>
  </tr>
</table>

</a>
```
</a>

This code waits until the called program prints "Your name?",
and enters "Mortimer&lt;enter&gt;".
Then it waits for "What does it do"
and enters "Test framework for documentation&lt;enter&gt;".



## Calling Global Commands

If you want to call a command provided by your code base,
you have to tell TextRunner the path to it.
As an example, if your code provides an executable called `tool`,
and it is stored as `public/tool` in your source code,
<a textrun="verify-source-file-content">
your __text-run.yml__ needs to contains this section:

```
actions:

  runConsoleCommand:
    globals:
      tool: 'public/tool'
```

The
[global-tool](../examples/global-tool)
folder contains a working version of this configuration.
</a>


#### More info

- [feature specs](../../features/actions/built-in/run-console-command/)
- [source code](../../src/actions/run-console-command.js)
