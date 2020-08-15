# Text-Runner Actions for the Text-Runner workspace

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for working with files.

- [installation](#installation)
- [cd action](#cd-action)

### installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-workspace
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-workspace
</pre>

### cd action

The <code textrun="action/name-full">workspace/cd</code> action changes the
current working directory into the given directory inside the workspace. Example
documentation snippet to demonstrate the use case:

<a textrun="run-in-textrunner">

```html
Create a
<code textrun="workspace/create-directory">foo</code>
directory. Now you can change into it via this Markdown code:

<code textrun="workspace/cd">foo</code>
```

</a>
