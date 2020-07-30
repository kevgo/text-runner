# Text-Runner Actions for npm

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of npm packages.

### Installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-npm
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-npm
</pre>

### Verify installation instructions

The <b textrun="action/name-full">npm/install</b> action verifies that the
documentation of an npm package correctly describes that this package should be
installed as a development dependency.

As an example, let's assume we are testing the documentation of an npm package
called `foobar`, <a textrun="create-file">i.e. its **package.json** file
contains amongst other things:

```json
{
  "name": "foobar"
}
```

</a>

<a textrun="create-file">

In the documentation of this npm package, for example its **README.md** file, we
want to document how to install this package. It could look like this:

```md
You can install this package like this:

<pre textrun="npm/install">
$ npm install foobar
</pre>

or with Yarn:

<pre textrun="npm/install">
$ yarn add foobar
</pre>
```

</a>

<a textrun="run-textrunner">

Text-Runner verifies that the installation instructions contain the correct name
of the npm package.

</a>

### Verify exported binaries

The <b textrun="action/name-full">npm/bin</b> action verifies documentation of
exported binaries of npm packages.
