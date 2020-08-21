# Text-Runner JavaScript Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for JavaScript code snippets inside documentation.

## Installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-javascript
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-javascript
</pre>

## Run JavaScript

Assume your documentation instructs the reader to run a line of JavaScript. It
could contain something like this:

````md
Let's run our first JavaScript command:

```js
console.log("Hello world!")
```
````

When you assign the <b textrun="action/name-full">javascript/run</b> type to
this document part, Text-Runner executes the JavaScript similar to how the user
would:

<!-- prettier-ignore-start -->

<a textrun="extension/run-region">

````html
Let's run our first JavaScript command:

<a textrun="javascript/run">

```js
console.log("Hello world")
```

</a>
````

</a>

<!-- prettier-ignore-end -->

You can simplify this to:

<a textrun="extension/run-region">

```html
Let's run our first JavaScript command:

<pre textrun="javascript/run">
console.log("Hello world!")
</pre>
```

</a>

### Asynchronous JavaScript

The <i textrun="action/name-full">javascript/run</i> action waits for the code
block to finish. To wait for asynchronous code, add the placeholder `<CALLBACK>`
where your code would call the callback when its done. Only one placeholder is
allowed per code block. Example:

<a textrun="javascript/run">

```js
const fs = require('fs')
fs.writeFile('hello.txt', 'hello world', <CALLBACK>)
```

</a>

You can also use `// ...` as the placeholder:

<a textrun="javascript/run">

```js
const fs = require("fs")
fs.writeFile("hello.txt", "hello world", function (err) {
  // ...
})
```

</a>

### Sharing JavaScript variables

Let's say your documentation contains two blocks of JavaScript that share a
variable:

<a textrun="javascript/run">

```js
const text = "hello"
```

</a>

and

<a textrun="javascript/run">

```js
const complete = text + "world"
```

</a>

Each JavaScript region runs in its own isolated environment. The second region
would not see the variable `text` from the first region. They do share the
`global` object, though. To share local variables between different blocks of
Javascript, this step replaces all occurrences of `const⎵`, `var⎵`, `let⎵`, and
`this.` with `global.` As an example, `const foo = 123` gets turned into
`global.foo = 123`, thereby making foo accessible in all code blocks.

## Validate JavaScript

The <b textrun="action/name-full">javascript/validate</b> action marks
documented JavaScript code that should not be executed. Example:

<a textrun="extension/run-region">

```html
<pre textrun="javascript/validate">
const a = 1;
</pre>
```

</a>
