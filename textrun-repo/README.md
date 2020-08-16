# Text-Runner Actions for verifying the content of the current repository

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying documentation containing the content of its repository.

- [installation](#installation)
- [file-content](#file-content)

### installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-repo
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-repo
</pre>

### file-content

The <b textrun="action/name-full">source/file-content</b> action verifies that
documentation listing the content of a file in the repository. As an example,
consider a codebase contains a file
<a textrun="workspace/create-file">**config.yml** with content `foo: bar`</a>.
The documentation for this codebase might want to document this configuration
file. It could look something like this:

<a textrun="run-in-textrunner">

````md
<a textrun="repo/file-content">

The **config.yml** file defines configuration values. Here is what we use:

```
foo: bar
```

</a>
````

</a>
