# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for documenting console commands to be executed by the reader.

### Setup

To add this package as a Text-Runner plugin, run <code type="npm/install">npm i
-D textrun-shell</code> or <code type="npm/install">yarn i -D
textrun-shell</code>.

<!-- TODO: verify this somehow -->

You can define the absolute path of documented binaries in a
**textrun-shell.js** file in the root directory of your documentation. Here is
an example:

```js
export default {
  binaries: {
    "text-runner": path.join(__dirname, "node_modules", ".bin", "text-runner"),
  },
}
```

### Run shell commands

The <b type="action/name-full">shell/command</b> action runs a shell command and
waits until it finishes. As an example, here is a little hypothetical Shell
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

The source code of this Shell tutorial when executed and verified by Text-Runner
looks like this:

<a type="extension/runnable-region">

```md
The "echo" command prints text on the command line. For example, let's run:

<pre type="shell/command">
$ echo Hello world!
</pre>

It welcomes us with a nice greeting:

<pre type="shell/command-output">
Hello world!
</pre>
```

</a>

Dollar signs at the beginning of lines indicate a shell prompt and are ignored.
The <b type="action/name-full">shell/command-output</b> action documents output
of the last shell command run.

### User input

You can run a shell command and enter text into it with the
<b type="action/name-full">shell/command-with-input</b> action.

<a type="workspace/new-file">

As an example, let's say we have a command-line tool written in JavaScript
called **greeter.js**:

```js
import * as readline from "readline"
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

rl.question("your name\n", name => {
  rl.question("which day is today\n", day => {
    console.log(`Hello ${name}, happy ${day}!`)
    rl.close()
    process.exit()
  })
})
```

</a>

<a type="shell/command-with-input">

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

<pre type="shell/command-output">
Hello Text-Runner, happy Friday!
</pre>.

If the table contains multiple columns, the first column contains output to wait
for, and the last one text to enter once the output from the first column has
appeared. Middle columns are ignored. `<th>` elements are considered
descriptions and are also ignored.

### Long-running processes

Long-running processes, for example web or database servers, keep running while
Text-Runner continues executing other actions.

<a type="workspace/new-file">

As an example, let's say we have a server called **server.js**:

```js
console.log("server is running")
setTimeout(() => {}, 100_000)
```

</a>

Start this long-running server to run in parallel with Text-Runner with the
<b type="action/name-full">shell/server</b> action. Wait for output using the
<b type="action/name-full">shell/server-output</b> action. Stop the server with
the <b type="action/name-full">shell/stop-server</b> action. Here is an example
that shows them in action:

<a type="extension/runnable-region">

```html
Start the server:

<pre type="shell/server">
$ node server.js
</pre>

Wait until it is fully booted up:

<pre type="shell/server-output">
server is running
</pre>

Now you can interact with the server. When you are done, stop the server:
<a type="shell/stop-server">shell/stop-server</a>
```

</a>
```
