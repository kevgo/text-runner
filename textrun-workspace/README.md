# Text-Runner Actions for the Text-Runner test workspace

Some Text-Runner actions create files and folders on disk. These files and
folders get created in a temporary directory called the _workspace_ so that they
don't interfere with the codebase that you document. This package provides
[Text-Runner](https://github.com/kevgo/text-runner) actions for interacting with
this Text-Runner workspace.

## installation

<a type="npm/install">

```
npm i -D textrun-workspace
```

</a>

## new-directory

The <b type="action/name-full">workspace/new-directory</b> action creates a
directory with the given name in the workspace. Here is a usage example:

<a type="extension/runnable-region">

```html
Create a directory named <b type="workspace/new-directory">utils</b>.
```

</a>

When executing this Markdown snippet, Text-Runner will create a
<i type="workspace/existing-directory">utils</i> directory in the workspace,
just as the user would.

### "dir" attribute

You can override in which directory the new directory gets created by providing
a `dir` attribute:

<a type="extension/runnable-region">

```html
Create a directory named <code type="workspace/new-directory" dir="subdir">utils</code>.
```

</a>

When executing this Markdown snippet, Text-Runner will create a
<i type="workspace/existing-directory">subdir/utils</i> directory in the
workspace.

## new-file

The <b type="action/name-full">workspace/new-file</b> action creates a file in
the workspace. This action assumes that the documentation writes the filename in
_emphasized_ or **bold** text, or inside a `filename` attribute, and the file
content is a code block with one or three backticks. Here are a few examples
that all do the same thing. See if you can figure out what that is.

<a type="extension/runnable-region">

```markdown
<a type="workspace/new-file">

Create file _apples.txt_ with the content `Fuji apples are the best`.

</a>
```

</a>

<a type="extension/runnable-region">

````markdown
<a type="workspace/new-file">

Create file **apples.txt** with the content:

```
Fuji apples are the best
```

</a>
````

</a>

<a type="extension/runnable-region">

```markdown
<pre type="workspace/new-file" filename="apples.txt">
Fuji apples are the best
</pre>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/existing-file-with-content">_apples.txt_ and content
`Fuji apples are the best`</a> in the workspace.

## empty-file

The <b type="action/name-full">workspace/empty-file</b> action creates an empty
file. An example is this documentation:

<a type="extension/runnable-region">

```html
Please create an empty file <b type="workspace/empty-file">.gitkeep</b>.
```

</a>

When executing the documentation, Text-Runner will create a file with name
<i type="workspace/existing-file">.gitkeep</i> in the workspace.

### "dir" attribute

You can override in which directory to create the empty file by providing a
`dir` attribute:

<a type="extension/runnable-region">

```html
Please create an empty file <b type="workspace/empty-file" dir="subdir">.gitkeep</b>.
```

</a>

When executing the documentation, Text-Runner will create a file with name
<i type="workspace/existing-file">subdir/.gitkeep</i> in the workspace.

## directory

The <b type="action/name-full">workspace/existing-directory</b> action verifies
that the workspace contains a directory with the given name. As an example,
consider this documentation snippet:

<a type="extension/runnable-region">

```html
Please run the command <code type="shell/command">mkdir images</code>. If
everything goes well, your computer will now have a new directory
<i type="workspace/existing-directory">images</i>. You can store images in it.
```

</a>

## existing-file

## file-content

The <b type="action/name-full">workspace/existing-file</b> action verifies that
a file with the given name exists and has the given content. This action assumes
that the documentation contains the filename as _emphasized_ or **strong** text
and the file content as a code block with single or triple backticks. As an
example, consider the following documentation snippet:

<a type="extension/runnable-region">

```markdown
Assuming a file <a type="workspace/new-file">_hello.txt_ with content
`hello world`</a>, we can verify it via this action:

<a type="workspace/existing-file-with-content">The file _hello.txt_ now contains
`hello world`.</a>
```

## specifying the directory

By default, actions in this plugin create the files in the workspace. To create
them in a different directory, provide a `dir` attribute at the region marker
containing the relative path to the directory to use. As an example, consider
the following documentation snippet:

<a type="extension/runnable-region">

```markdown
<a type="workspace/new-file" dir="subdir">

Please create a file _apples.txt_ with the content `Boskoop`.

</a>
```

</a>

<a type="workspace/existing-file-with-content">

When executing the documentation, Text-Runner will create a file
_subdir/apples.txt_ and content `Boskoop`

</a>.

## working-dir

Each Text-Runner test starts in the workspace directory. The
<b type="action/name-full">workspace/working-dir</b> action changes the working
directory of the test runner to another directory inside the workspace. To
change into the directory the reader created above:

<a type="extension/runnable-region">

```html
Please change into the
<code type="workspace/working-dir">utils</code>
folder.
```

</a>
