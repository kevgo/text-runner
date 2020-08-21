# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for documenting console commands to be executed by the reader.

### Setup

<!-- TODO: convert to inline <code> -->

To add this package as a Text-Runner plugin:

<pre textrun="npm/install">
npm i -D textrun-shell
</pre>

or

<pre textrun="npm/install">
yarn i -D textrun-shell
</pre>

You can define the absolute path of documented binaries in a
**textrun-shell.js** file in the root directory of your documentation. Here is
an example:

```js
module.exports = {
  binaries: {
    "text-run": path.join(__dirname, "node_modules", ".bin", "text-run"),
  },
}
```

### Run shell commands

The <b textrun="action/name-full">shell/exec</b> action runs a shell command and
waits until it finishes. As an example, here is a little hypothetical Bash
tutorial:

> The "echo" command prints text on the command line. For example, let's run:
>
> ```
> $ echo Hello world!
> ```
>
> It welcomes us with a nice greeting:
>
> ```
> Hello world!
> ```

The source code of this Bash tutorial when executed and verified by Text-Runner
looks like this:

<a textrun="extension/run-region">

```md
The "echo" command prints text on the command line. For example, let's run:

<pre textrun="shell/exec">
$ echo Hello world!
</pre>

It welcomes us with a nice greeting:

<pre textrun="shell/exec-output">
Hello world!
</pre>
```

</a>

Dollar signs at the beginning of lines indicate a shell prompt and are ignored.
The <b textrun="action/name-full">shell/exec-output</b> action documents output
of the last shell command run.

### User input

You can run a shell command and enter text into it with the
<b textrun="action/name-full">shell/exec-with-input</b> action.

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

rl.question("your name\n", (name) => {
  rl.question("which day is today\n", (day) => {
    console.log(`Hello ${name}, happy ${day}!`)
    rl.close()
    process.exit()
  })
})
```

</a>

<a textrun="shell/exec-with-input">

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

It prints:

<pre textrun="shell/exec-output">
Hello Text-Runner, happy Friday!
</pre>.

If the table contains multiple columns, the first column contains output to wait
for, and the last one text to enter once the output from the first column has
appeared. Middle columns are ignored. `<th>` elements are considered
descriptions and are also ignored.

### Long-running processes

Long-running processes, for example web or database servers, keep running while
Text-Runner continues executing other actions.

<a textrun="workspace/create-file">

As an example, let's say we have a server called **server.js**:

```js
console.log("server is running")
setTimeout(() => {}, 100_000)
```

</a>

Start this long-running server to run in parallel with Text-Runner with the
<b textrun="action/name-full">shell/start</b> action. Wait for output using the
<b textrun="action/name-full">shell/start-output</b> action. Stop the server
with the <b textrun="action/name-full">shell/stop</b> action. Here is an example
that shows them in action:

<a textrun="extension/run-region">

```html
Start the server:

<pre textrun="shell/start">
$ node server.js
</pre>

Wait until it is fully booted up:

<pre textrun="shell/start-output">
server is running
</pre>

Now you can interact with the server. When you are done, stop the server:
<a textrun="shell/stop">shell/stop</a>
```

</a>
```
