# Text-Runner Actions for verifying the documentation of Text-Runner extensions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM packages that contain extensions
for Text-Runner.

### Running Text-Runner inside Text-Runner

When documenting a Text-Runner extension, you might want to provide examples of
how to use your extension. The Markdown code in the README.md file of your
extension will list snippets of Markdown to the user that visualize how to use
your extension. The documentation of the Text-Runner plugins in this mono-repo
provide usage examples.

While verifying such "nested" documentation" using Text-Runner, the
<b type="action/name-full">extension/runnable-region</b> action executes these
embedded Markdown snippets in a separate Text-Runner instance. That separate
Text-Runner instance runs in the workspace of its parent Text-Runner instance.

For more complex use cases, for example where your documentation needs to create
more files before running Text-Runner, you can use the
<b type="action/name-full">extension/run-textrunner</b> instance.

### installation

To use these actions, add this package as a development dependency by running

<pre type="npm/install">
$ npm i -D textrun-extension
</pre>
