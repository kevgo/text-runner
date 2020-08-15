# Text-Runner Actions for the Text-Runner workspace

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for working with files.

### Installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-workspace
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-workspace
</pre>

### changing the current working directory

The <code textrun="action/name-full">workspace/cd</code> action changes the
current working directory into the given directory. Example documentation
snippet to demonstrate the use case:

<a textrun="run-in-textrunner">

```html
Create a
<code textrun="workspace/mkdir">foo</code>
directory. you can change into it via this Markdown code:

<code textrun="workspace/cd">foo</code>
```

</a>
