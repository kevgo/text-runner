# Text-Runner Actions for the Text-Runner workspace

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for working with files.

- [installation](#installation)
- [cd action](#cd-action)

### installation

To use these actions, add this package as a development dependency by running

<pre type="npm/install">
$ npm i -D textrun-workspace
</pre>

or

<pre type="npm/install">
$ yarn i -D textrun-workspace
</pre>

### cd action

The <b type="action/name-full">workspace/working-dir</b> action changes the
current working directory into the given directory inside the workspace. As an
example, consider the following documentation snippet:

<a type="extension/run-region">

```html
Create a
<code type="workspace/create-directory">foo</code>
directory. Now you can change into it via this Markdown code:
<code type="workspace/working-dir">foo</code>
```

</a>

### create-directory

The <b type="action/name-full">workspace/create-directory</b> action creates a
directory with the given name in the workspace. As an example, consider this
snippet of documentation:

<a type="extension/run-region">

```html
To get started, please create a directory named
<b type="workspace/create-directory">utils</b>. We will put all the utilities we
create later in there.
```

</a>

<!-- TODO: verify the folder exists -->

When executing the documentation, Text-Runner will create a
<i type="workspace/directory">utils</i> directory in the workspace, just as the
user would.

### create-file

The <b type="action/name-full">workspace/create-file</b> action creates a file
in the workspace. This action assumes that the filename is written in
_emphasized_ or **bold** text and the file content is a code block with one or
three backticks. As an example, consider the following documentation snippet:

<a type="extension/run-region">

```markdown
<a type="workspace/create-file">Please create a file _apples.txt_ with the
content `Fuji`.</a>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/file-content">_apples.txt_ and content `Fuji`</a>.
Alternatively, the documentation could also read like this:

<a type="extension/run-region">

````markdown
<a type="workspace/create-file">

Please create a file with name **more-apples.txt** and the content:

```
Gala
```

</a>
````

</a>

Similarly, Text-Runner will create a file
<a type="workspace/file-content">_more-apples.txt_ with content `Gala`</a>.

### directory

The <b type="action/name-full">workspace/directory</b> action verifies that the
workspace contains a directory with the given name. As an example, consider this
documentation snippet:

<a type="extension/run-region">

```html
Please run the command <code type="shell/command">mkdir images</code>. If
everything goes well, your computer will now have a new directory
<i type="workspace/directory">images</i>. You can store images in it.
```

</a>

### file-content

The <b type="action/name-full">workspace/file-content</b> action verifies that a
file with the given name exists and has the given content. This action assumes
that the documentation contains the filename as _emphasized_ or **strong** text
and the file content as a code block with single or triple backticks. As an
example, consider the following documentation snippet:

<a type="extension/run-region">

```markdown
Assuming a file <a type="workspace/create-file">_hello.txt_ with content
`hello world`</a>, we can verify it via this action:

<a type="workspace/file-content">The file _hello.txt_ now contains
`hello world`.</a>
```
