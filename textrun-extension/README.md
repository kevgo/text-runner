# Text-Runner Actions for verifying the documentation of Text-Runner extensions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying documentation of NPM packages providing extensions for
Text-Runner.

- [installation](#installation)
- [run-in-textrunner](#run-in-textrunner)
- [run-textrunner](#run-textrunner)

### installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-extension
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-extension
</pre>

### run-textrunner

The <b textrun="action/name-full">run-textrunner</b> action executes a new
instance of Text-Runner in the Text-Runner workspace. This allows testing
documentation for Text-Runner itself, or for a Text-Runner extension.

To see an example in action, take a look at the source code of the
[README.md](../textrun-make/README.md#verify-make-commands) file of the
[textrun-make](../textrun-make/) codebase.

### run-text

The When documenting a Text-Runner extension, you might want to provide examples
of how to use your extension. The Markdown code in the README.md file of your
extension will quote snippets of Markdown that use your extension. An example is
the documentation of the
[textrun-make](../textrun-make/README.md#verify-make-commands) package. The
`run-in-textrunner` action executes these Markdown snippets in Text-Runner.
