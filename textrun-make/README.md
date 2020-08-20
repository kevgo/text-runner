# Text-Runner Actions for Makefiles

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying documentation mentioning
[Make](<https://en.wikipedia.org/wiki/Make_(software)>) targets.

### Installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-make
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-make
</pre>

### Verify Make commands

The <b textrun="action/name-full">make/command</b> action verifies that the
mentioned Make command exists. <a textrun="workspace/create-file">As an example,
consider a codebase that contains this **Makefile**:

```
foo:
  echo building foo
```

</a>

<a textrun="workspace/create-file">

In the documentation of this codebase, for example its **README.md** file, we
want to document how to build it. This part could look like this:

```html
Build the foo package by running <code textrun="make/command">make foo</code>
```

</a>

<a textrun="extension/run-textrunner">

Text-Runner verifies that the `Makefile` contains the `foo` target.

### Verify Make targets

The <b textrun="action/name-full">make/target</b> action verifies that the
mentioned Make target exists. <a textrun="workspace/append-file"> In our example
codebase the **README.md** file could contain another part:

```html
If it doesn't work, just run the <code textrun="make/target">foo</code> target
again.
```

</a>

<a textrun="extension/run-textrunner">

Text-Runner verifies that the `Makefile` contains the `foo` target.
