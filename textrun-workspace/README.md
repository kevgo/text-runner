# Text-Runner Actions for the Text-Runner workspace

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for working with files.

- [installation](#installation)
- [cd action](#cd-action)

### installation

To use these actions, add this package as a development dependency by running

<pre textrun="npm/install">
$ npm i -D textrun-workspace
</pre>

or

<pre textrun="npm/install">
$ yarn i -D textrun-workspace
</pre>

### cd action

The <code textrun="action/name-full">workspace/cd</code> action changes the
current working directory into the given directory inside the workspace. Example
documentation snippet to demonstrate the use case:

<a textrun="run-in-textrunner">

```html
Create a
<code textrun="workspace/create-directory">foo</code>
directory. Now you can change into it via this Markdown code:

<code textrun="workspace/cd">foo</code>
```

</a>

# create-directory

The <code textrun="action/name-full">workspace/create-directory</code> action
creates a directory with the given name in the workspace. As an example,
consider this snippet of documentation:

<a textrun="run-in-textrunner">

```markdown
To get started, please create a directory named
<b textrun="workspace/create-directory">utils</b>.
```

</a>

When executing the documentation, Text-Runner will create a
<i textrun="workspace/directory">utils</i> directory in the workspace, just as
the user would.

### create-file

The <code textrun="action/name-full">workspace/create-file</code> action creates
a file in the workspace. This action assumes that the filename is written in
_emphasized_ or **bold** text and the file content is a code block with one or
three backticks. As an example, consider the following documentation snippet:

<a textrun="run-in-textrunner">

```markdown
<a textrun="workspace/create-file">

Please create a file _test.txt_ with the content `foo`.

</a>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a textrun="workspace/file-content">_test.txt_ and content `foo`</a>.

Alternatively, the documentation could also read like this:

<a textrun="run-in-textrunner">

````markdown
<a textrun="create-file">

Please create a file with name **test2.txt** and the content:

```
foo
```

</a>
````

</a>

Similarly, Text-Runner will create a file
<a textrun="workspace/file-content">_test2.txt_ with content `foo`</a>.

### directory

The <code textrun="action/name-full">workspace/directory</code> action verifies
that the workspace contains a directory with the given name. As an example,
consider this documentation snippet:

<a textrun="run-in-textrunner">

```markdown
Please run the command <code textrun="shell/exec">mkdir images</code>. If
everything goes well, your computer will now have a new directory
<i textrun="workspace/directory">images</i>. You can store images in it.
```

</a>

### file-content

The <code textrun="action/name-full">workspace/file-content</code> action
verifies that a file with the given name exists and has the given content. This
action assumes that the documentation contains the filename as _emphasized_ or
**strong** text and the file content as a code block with single or triple
backticks. As an example, consider the following documentation snippet:

<a textrun="run-in-textrunner">

```markdown
<a textrun="workspace/create-file">

Assuming a file _hello.txt_ with content `hello world`, we can verify it via
this action:

</a>

<a textrun="workspace/file-content">

The file _hello.txt_ now contains `hello world`.

</a>
```
