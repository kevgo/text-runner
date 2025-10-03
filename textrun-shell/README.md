# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for documenting console commands to be executed by the reader.

## Setup

To add this package as a Text-Runner plugin:

<pre type="npm/install">
npm i -D textrun-shell
</pre>

<!-- TODO: verify this somehow -->

You can define the absolute path of binaries that your documentation tests call
by creating a file **textrun-shell.js** file in the root directory of your
documentation. Here is an example:

```js
import * as path from "path"
import * as url from "url"

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const foo_path = path.join(__dirname, "bin", "foo")
// console.log(`calling "foo" in the documentation now runs ${foo_path}`)

export default {
  globals: {
    "foo": foo_path
  }
}
```

## shell/command

The <b type="action/name-full">shell/command</b> action runs a shell command and
waits until it finishes. The <b type="action/name-full">shell/command-output</b>
action verifies the output of the most recently executed shell command.

As an example, here is a hypothetical tutorial for how to use the Linux shell:

<a type="extension/runnable-region">

```html
The "echo" command prints text on the command line. For example, let's run:

<pre type="shell/command">
echo Hello world!
</pre>
```

</a>

Some tutorials print a dollar sign at the beginning of the command to execute,
indicating an interactive command prompt. These dollar signs are ignored.

### allow-error attribute

By default, this step fails if the subshell command exits with a non-zero exit
code. To allow errors, add the `allow-error` attribute, like so:

```html
<pre type="shell/command" allow-error>
echo Hello world!
</pre>
```

## shell/command-output

The <b type="action/name-full">shell/command-output</b> action verifies the
output of the most recently executed shell command.

Here is the next paragraph of our hypothetical tutorial for the Linux shell:

<a type="extension/runnable-region">

```md
It welcomes us with a nice greeting:

<pre type="shell/command-output">
Hello world!
</pre>
```

</a>

Some tutorials print a dollar sign at the beginning of the command to execute,
indicating an interactive command prompt. These dollar signs are ignored.

## shell/command-with-input

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
  terminal: false
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
node greeter.js
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
    <td>Monday</td>
  </tr>
</table>

</a>

It prints:

<pre type="shell/command-output">
Hello Text-Runner, happy Monday!
</pre>

If the table contains multiple columns, the first column contains output to wait
for, and the last one text to enter once the output from the first column has
appeared. Middle columns are ignored. `<th>` elements are considered
descriptions and are also ignored.

## shell/server

Long-running processes, for example web or database servers, keep running while
Text-Runner continues executing other actions.

<a type="workspace/new-file">

As an example, let's say we write a tutorial about developing a web server, have
just created an implementation in file **server.js**:

```js
console.log("server is running")
setTimeout(() => {}, 100_000)
```

</a>

Our tutorial instructs the user to start this long-running server to run in
parallel with Text-Runner with the
<b type="action/name-full">shell/server</b> action:

<a type="extension/runnable-region">

```html
Start the server:

<pre type="shell/server">
node server.js
</pre>
```

</a>

## shell/server-output

After we started a long-running server through
<em type="action/name-full">shell/server</em> above, we can await specific
output from it using the
<b type="action/name-full">shell/server-output</b> action.

Here is the next paragraph of our hypothetic server tutorial:

<a type="extension/runnable-region">

```html
Wait until the server is fully booted up:

<pre type="shell/server-output">
server is running
</pre>
```

</a>

## shell/stop-server

Stop a long-running process with the
<b type="action/name-full">shell/stop-server</b> action.

Here is the final part of our hypothetical server tutorial:

<a type="extension/runnable-region">

```html
When you are done, stop the server:

<pre type="shell/stop-server">
killall node
</pre>
```

</a>
