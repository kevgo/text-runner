# Text-Runner Actions for NPM

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying the documentation of NPM packages.

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
documentation of an NPM package correctly describes that this package should be
installed as a development dependency.

<a textrun="create-file">

As an example, let's assume we are testing the documentation of an NPM package
called "foobar", i.e. its **package.json** file contains amongst other things
this entry:

```json
{
  "name": "foobar"
}
```

</a>

<a textrun="create-file">

In the documentation of this NPM package, for example its **README.md** file, we
want to document how to install this package. It could look like this:

```md
## Installation

You can install this package like this:

<pre textrun="npm/install">
$ npm install foobar
</pre>

or with Yarn:

<pre textrun="npm/install">
$ yarn add foobar
<pre>
```

</a>

Text-Runner verifies that the installation instructions are accurate, i.e.
contain the correct name of the NPM package and the right command to install it.
