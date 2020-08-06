# Text-Runner JavaScript Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for JavaScript code snippets inside documentation.

### Installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-javascript
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-javascript
</pre>

### Run JavaScript

A tag with the <b textrun="action/name-full">javascript/run</b> action
delineates a block of JavaScript that the user should execute. As an example,
Text-Runner prints "Hello world!" when your documentation contains this block:

<a textrun="run-in-textrunner">

```html
<pre textrun="javascript/run">
console.log("Hello world!")
</pre>
```

</a>

TextRunner waits for the code block to finish. To make it wait until
asynchronous code is done, add the placeholder <CALLBACK> where your code would
call the callback when its done. Only one placeholder is allowed. Example:

<a textrun="run-javascript">

```
const fs = require('fs')
fs.writeFile('hello.txt', 'hello world', <CALLBACK>)
```

</a>

Alternatively you can use `// ...` as the placeholder:

<a textrun="run-javascript">

```
const fs = require('fs')
fs.writeFile('hello.txt', 'hello world', function(err) {
  // ...
})
```

</a>

Each block of Javascript code runs in its own environment. To share local
variables between different blocks of Javascript, this step performs the the
following replacements:

- `const⎵` --> `global.`
- `var⎵` --> `global.`
- `let⎵` --> `global.`
- `this.` --> `global.`

As an example, `const foo = 123` gets turned into `global.foo = 123`, thereby
making foo accessible in all code blocks.

### Validate JavaScript

A tag with the <b textrun="action/name-full">javascript/validate</b> action
delineates JavaScript inside the documentation that should not be executed. Here
is an example:

<a textrun="run-in-textrunner">

```html
<pre textrun="javascript/validate">
const a = 1;
</pre>
```

</a>
