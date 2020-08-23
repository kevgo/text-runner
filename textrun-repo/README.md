# Text-Runner Actions for verifying the content of the current repository

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for verifying documentation containing the content of source code files
from the repository.

- [installation](#installation)
- [file-content](#file-content)

### installation

To use these actions, add this package as a development dependency by running

<pre type="npm/install">
$ npm i -D textrun-repo
</pre>

or

<pre type="npm/install">
$ yarn i -D textrun-repo
</pre>

### file-content

Sometimes you want to just display a file from your application's source code in
the documentation. The <b type="action/name-full">source/existing-file</b>
action verifies such documentation. As an example, consider a codebase contains
a file <a type="workspace/new-file">**config.yml** with content `foo: bar`</a>.
The documentation for this codebase might want to mention this configuration
file:

<a type="extension/run-region">

````markdown
<a type="repo/existing-file">

The **config.yml** file defines configuration values. The current settings are:

```
foo: bar
```

</a>
````

</a>

This action assumes that the documentation contains the filename in bold or
italic and the content as a single or triple fenced code block. The filename of
the source code file is relative to the Markdown file describing it. You can
also provide a directory in which your file is located via a link in the active
region. <a type="workspace/new-file"> Let's say you have a file
**foo/bar/hello.txt** in your code base with the content `hello world!`. </a>
You can display its content in your documentation via this active region:

<a type="extension/run-region">

```markdown
<a type="repo/existing-file">

The **hello.txt** file in the [bar folder](foo/bar) contains this section:

`hello world!`

</a>
```

</a>
