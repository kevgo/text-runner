# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for running console commands. These commands run in Text-Runner's
[workspace directory](#interacting-with-the-local-filesystem).

### Installation

<a textrun="actions/package-json">

To use these actions, add this package to your [package.json](package.json) file
by running

<a textrun="npm/dev-install">

```
$ npm i -D textrun-shell
```

or

```
$ yarn i -D textrun-shell
```

</a>

<a textrun="npm/package-json-part">

Your `package.json` file should end up containing (amongst other things) these
entries:

```json
  "devDependencies": {
    "text-runner": "4.0.3",
    "textrun-shell": "0.0.0"
  }
```

</a>

### Short-lived commands

The <code textrun="action/full-name">shell/exec</code> action runs a shell
command and waits until it finishes:

<a textrun="run-in-textrun">

```html
<pre textrun="shell/exec">
$ echo Hello world!
</pre>
```

</a>

It ignores dollar signs at the beginning of lines, which indicate a shell
prompt. You can document the expected output of the shell command. For example,
the command above should print:

<a textrun="run-in-textrun">

```html
<pre textrun="shell/exec-output">
Hello world!
</pre>
```

</a>

### User input

You can enter text into the running command by providing an HTML table with the
content to enter.

<a textrun="workspace/create-file">

As an example, let's say we have a command-line tool written in JavaScript
called **greeter.js**:

```js
const readline = require("readline")
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

rl.question("your name", (name) => {
  rl.question("which day is today", (day) => {
    console.log(`Hello ${name}, happy ${day}!`)
    rl.close()
  })
})
```

</a>

<a textrun="workspace/exec">

Run this tool on the command line

```
$ node greeter.js
```

and provide user input with an HTML table:

<table>
  <tr>
    <th>Output to wait for</th>
    <th>input</th>
  </tr>
  <tr>
    <td>your name</td>
    <td>Text-Runner</td>
  </tr>
  <tr>
    <td>which day is today</td>
    <td>Friday</td>
  </tr>
</table>

</a>

It will print <code textrun="shell/exec-output">Hello Text-Runner, happy
Friday!</code>.

If the table contains multiple columns, the first column contains output to wait
for, and the last one text to enter once the output from the first column has
appeared. Middle columns are ignored. `<th>` elements are considered
descriptions and are also ignored.

### Long-running processes

Long-running processes, for example web or database servers, keep running while
Text-Runner continues executing other actions.

<a textrun="file/create">

As an example, let's say we have a server called **server.js**:

```js
console.log("server is running")
setTimeout(() => {}, 100_000)
```

</a>

Start this long-running server to run in parallel with Text-Runner with the
<b textrun="action/name">shell/start</b> action. Wait for output using the
<b textrun="action/name">shell/server-output</b> action. Stop the server with
the <b textrun="action/name">shell/server-stop</b> action. Here is an example
that shows them in action:

<a textrun="run-in-textrunner">

```html
<pre textrun="shell/start">
$ node server.js
</pre>

Wait until it is fully booted up:

<pre textrun="shell/server-output">
server is running
</pre>

Now you can interact with the server. If it is a web server, open up a browser
and click buttons. If it is an API server, make API calls to it. When you are
done, you can stop the server using the <b textrun="action/name">shell/stop</b>
action:

<a textrun="shell/server-stop"></a>
```
