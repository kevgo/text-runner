# Text-Runner Actions for Makefiles

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying documentation mentioning
[Make](https://en.wikipedia.org/wiki/Make_(software)) targets.

### Installation

To use these actions, add this package as a development dependency by running
<code type="npm/install">npm i -D textrun-make</code>.

### Verify Make commands

The <b type="action/name-full">make/command</b> action verifies that the
mentioned Make command exists. <a type="workspace/new-file">As an example,
consider a codebase that contains this **Makefile**:

```
foo:
  echo building foo
```

</a>

<a type="workspace/new-file">

In the documentation of this codebase, for example its **README.md** file, we
want to document how to build it. This part could look like this:

```html
Build the foo package by running <code type="make/command">make foo</code>
```

</a>

<a type="extension/run-textrunner">

Text-Runner verifies that the `Makefile` contains the `foo` target.

### Verify Make targets

The <b type="action/name-full">make/target</b> action verifies that the
mentioned Make target exists. <a type="workspace/append-file"> In our example
codebase the **README.md** file could contain another part:

```html
If it doesn't work, just run the <code type="make/target">foo</code> target
again.
```

</a>

<a type="extension/run-textrunner">

Text-Runner verifies that the `Makefile` contains the `foo` target.

### Specifying the directory of the Makefile

If the Makefile is not in the root directory of your documentation base, you can
specify its directory using the `dir` attribute.
<a type="workspace/new-file" dir="foo"> As an example, this _README.md_ file
tells Text-Runner to use the Makefile in the parent directory of the
documentation base:

```html
Build the foo package by running
<code type="make/command" dir="..">make foo</code>
```

</a>

<a type="extension/run-textrunner" dir="foo">
