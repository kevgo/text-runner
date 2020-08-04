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

TODO: document callbacks

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
