# Text-Runner Actions for npm

hello

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of npm packages.

### Installation

To use these actions, add this package as a development dependency by running
<code type="npm/install">npm i -D textrun-npm</code> or
<code type="npm/install">yarn i -D textrun-npm</code>.

## Verify installation instructions

The <b type="action/name-full">npm/install</b> action verifies installation
instructions for an npm package. As an example, let's assume we are testing the
documentation of an npm package called `foobar`.
<a type="workspace/new-file">Its **package.json** file would contain amongst
other things:

```json
{
  "name": "foobar"
}
```

</a>

<a type="workspace/new-file">

In the documentation of this npm package, for example its **README.md** file, we
want to document how to install this package. It would contain a section that
looks something like this:

```md
Install the foobar package by running:

<pre type="npm/install">
$ npm install foobar
</pre>

or with Yarn:

<pre type="npm/install">
$ yarn add foobar
</pre>
```

</a>

<a type="extension/run-textrunner">

Text-Runner verifies that the installation instructions contain the correct name
of the npm package.

</a>

## Verify exported binaries

The <b type="action/name-full">npm/exported-executable</b> action verifies
documentation of exported binaries of npm packages. Let's say the source code of
our `foobar` package contains an executable file
<b type="bundled-executable">bin/foo</b>, which is listed as a binary in its
<a type="workspace/new-file">**package.json** file:

```js
{
  "name": "foobar",
  "bin": {
    "foo": "bin/foo"
  }
}
```

</a>

<a type="workspace/additional-file-content">

The **README.md** file for the "foobar" package would document this binary
something like this:

```md
After you install the "foobar" package, you can run the
<code type="npm/exported-executable">foo</code> command in the terminal.
```

<a type="extension/run-textrunner">
</a>

### Verify installed binaries

The <b type="action/name-full">npm/installed-executable</b> action verifies
binaries installed by other npm packages. Let's say you developer instructions
for a codebase that uses the <code type="create-npm-executable">cucumber</code>
command provided by the npm [cucumber](https://www.npmjs.com/package/cucumber)
package:

<a type="extension/runnable-region">

```html
To run the end-to-end tests, run
<code type="npm/installed-executable">cucumber</code> in the terminal.
```

</a>

### Verify scripts defined in package.json

You can verify that documented scripts that your `package.json` file defines exist:

```html
To run the unit tests, please call the <code type="npm/script">unit</code> script.
