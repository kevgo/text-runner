# Text-Runner JavaScript Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for JavaScript code snippets inside documentation.

## Installation

To use these actions, add this package as a development dependency by running
<code type="npm/install">npm i -D textrun-javascript</code>.

## Run JavaScript

Assume your documentation instructs the reader to run a line of JavaScript. It
could contain something like this:

````md
Let's run our first JavaScript command:

```js
console.log("Hello world!")
```
````

When you assign the <b type="action/name-full">javascript/runnable</b> type to
this document part, Text-Runner executes the JavaScript similar to how the user
would:

<!-- dprint-ignore-start -->

<a type="extension/runnable-region">

````html
Let's run our first JavaScript command:

<a type="javascript/runnable">

```js
console.log("Hello world")
```

</a>
````

</a>

<!-- dprint-ignore-end -->

You can simplify this to:

<a type="extension/runnable-region">

```html
Let's run our first JavaScript command:

<pre type="javascript/runnable">
console.log("Hello world!")
</pre>
```

</a>

### Asynchronous JavaScript

The <i type="action/name-full">javascript/runnable</i> action waits for the code
block to finish. To wait for asynchronous code, add the placeholder `<CALLBACK>`
where your code would call the callback when its done. Only one placeholder is
allowed per code block. Example:

<a type="javascript/runnable">

```js
function asyncFoo(done) {
  console.log("some async work")
  done()
}

asyncFoo(<CALLBACK>)
```

</a>

You can also use `// ...` as the placeholder:

<a type="javascript/runnable">

```js
function asyncFoo(done) {
  console.log("some async work")
  done()
}

asyncFoo(function(err) {
  // ...
})
```

</a>

### Sharing JavaScript variables

Let's say your documentation contains two regions of JavaScript that share a
variable:

<a type="javascript/runnable">

```js
const text = "hello"
```

</a>

and

<a type="javascript/runnable">

```js
const complete = text + "world"
```

</a>

Each JavaScript region runs in its own isolated environment. The second region
would not see the variable `text` from the first region. They do share the
`global` object, though. To share local variables between different regions of
Javascript, this step replaces all occurrences of `const⎵`, `var⎵`, `let⎵`, and
`this.` with `global.` As an example, `const foo = 123` gets turned into
`global.foo = 123`, thereby making foo accessible in all code regions.

## Validate JavaScript

The <b type="action/name-full">javascript/non-runnable</b> action marks
documented JavaScript code that should not be executed. Example:

<a type="extension/runnable-region">

```html
<pre type="javascript/non-runnable">
const a = 1;
</pre>
```

</a>
