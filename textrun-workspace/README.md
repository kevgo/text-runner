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

## new-file

The <b type="action/name-full">workspace/new-file</b> action creates a file in
the workspace. This action assumes that the documentation writes the filename in
_emphasized_ or **bold** text, or inside a `filename` attribute, and the file
content is a code block with one or three backticks. Here are a few examples
that all do the same thing. See if you can figure out what it does.

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

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/existing-file-with-content">_apples.txt_ and content
`Fuji apples are the best`</a> in the workspace.

### "dir" attribute

You can override in which directory Text-Runner looks for the file to append
content to with the `dir` attribute:

<a type="extension/runnable-region">

```markdown
<a type="workspace/new-file" dir="subdir">

Create file _apples.txt_ with the content `Fuji apples are the best`.

</a>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/existing-file-with-content">_subdir/apples.txt_ and content
`Fuji apples are the best`</a> in the workspace.

### "filename" attribute

If you don't want to repeat the filename in the text too often, you can also
provide it invisibly through the `filename` attribute. In that case, the file
content is the entire content of the active region.

<a type="extension/runnable-region">

```html
<pre type="workspace/new-file" filename="apples.txt">
Gala aren't that bad either!
</pre>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/existing-file-with-content">_apples.txt_ and content
`Gala aren't that bad either!`</a> in the workspace.

## additional-file-content

The <code type="action/name-full">workspace/additional-file-content</code>
action appends the given text to the given file.

Assume the workspace contains file <a type="workspace/new-file">
_greeting/hello.txt_ with content `hello`</a>. Then you execute this
documentation:

<a type="extension/runnable-region">

```html
<a type="workspace/additional-file-content">

Now append ` sun` to file _greeting/hello.txt_.

</a>.
```

</a>

<a type="workspace/existing-file-with-content">

Now file _greeting/hello.txt_ has content `hello sun`.

</a>

### "dir" attribute

You can override in which directory Text-Runner looks for the file to append
content to with the `dir` attribute:

<a type="extension/runnable-region">

```html
<a type="workspace/additional-file-content" dir="greeting">

Now append ` and moon` to file _hello.txt_.

</a>.
```

</a>

<a type="workspace/existing-file-with-content">

Now file _greeting/hello.txt_ has content `hello sun and moon`.

</a>

### "filename" attribute

If you don't want to repeat the filename in the text too often, you can also
provide it invisibly through the `filename` attribute. In that case, the file
content is the entire content of the active region.

<a type="extension/runnable-region">

```html
<code type="workspace/additional-file-content" filename="greeting/hello.txt">light</code>
```

</a>

<a type="workspace/existing-file-with-content">

Now file _greeting/hello.txt_ has content `hello sun and moonlight`.

</a>

## empty-file

The <b type="action/name-full">workspace/empty-file</b> action creates an empty
file. An example is this documentation:

<a type="extension/runnable-region">

```html
Please a file <b type="workspace/empty-file">.gitkeep</b>. It's okay to leave it empty.
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

### "filename" attribute

You can provide the filename invisibly through the `filename` attribute.

<a type="extension/runnable-region">

```html
<code type="workspace/empty-file" filename="otherdir/.gitkeep"></code>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<i type="workspace/existing-file">otherdir/.gitkeep</i> in the workspace.

## existing-directory

The <b type="action/name-full">workspace/existing-directory</b> action verifies
that the workspace contains a directory with the given name. As an example,
consider this documentation snippet:

<a type="extension/runnable-region">

```html
Please run the command <code type="shell/command">mkdir images</code>.

If everything goes well, your computer will now have a new directory
<i type="workspace/existing-directory">images</i>.
```

</a>

### "dir" attribute

You can override in which subdirectory of the workspace to look for the
directory by providing a `dir` attribute:

<a type="extension/runnable-region">

```html
Please run the command <code type="shell/command">mkdir subdir/images</code>.

If everything goes well, your computer will now have a new directory
<i type="workspace/existing-directory" dir="subdir">images</i>.
```

</a>

## existing-file

The <b type="action/name-full">workspace/existing-file</b> action verifies that
a file with the given name exists. As an example, assuming the workspace
contains a file
<em type="workspace/empty-file">hello.txt</em>, we can verify it's existence via
this action:

<a type="extension/runnable-region">

```markdown
<code type="workspace/existing-file">hello.txt</code>
```

</a>

### "dir" attribute

By default, this action looks for files in the workspace. You can tell it to
look in a different directory inside the workspace by providing a `dir`
attribute. Assuming the workspace contains a file
<em type="workspace/empty-file">subdir/hello.txt</em>, we can verify it's
existence via this action:

<a type="extension/runnable-region">

```markdown
<code type="workspace/existing-file" dir="subdir">hello.txt</code>
```

</a>

## existing-file-with-content

The <b type="action/name-full">workspace/existing-file-with-content</b> action
verifies that a file with the given name exists in the workspace and has the
given content. This action assumes that the documentation contains the filename
as _emphasized_ or **strong** text and the file content as a code block with
single or triple backticks.

Assuming the workspace contains a file <a type="workspace/new-file">_hello.txt_
with content `hello world`</a>, we can verify it via this action:

<a type="extension/runnable-region">

```markdown
<a type="workspace/existing-file-with-content">

The file _hello.txt_ now contains `hello world`.

</a>
```

</a>

### "dir" attribute

By default, this action creates the file in the workspace. To create it in a
different directory, provide a name of the directory using the `dir` attribute.

As an example, if the workspace contains file <a type="workspace/new-file">
_subdir/apples.txt_ with the content `Boskoop`</a>, we can verify it like this:

<a type="extension/runnable-region">

```markdown
<a type="workspace/existing-file-with-content" dir="subdir">
  The file <em>apples.txt</em> now contains <code>Boskoop</code>.
</a>
```

</a>

### "filename" attribute

If you don't want to repeat the filename in the text too often, you can also
provide it invisibly through the `filename` attribute. In that case, the file
content is the entire content of the active region.

<a type="extension/runnable-region">

```markdown
<a type="workspace/existing-file-with-content" filename="hello.txt">
hello world
</a>
```

</a>

### "partial-match" attribute

By default, this action matches the entire file content. If you want to verify
only a part of the file content, like a single line, provide the `partial-match`
attribute.

<a type="workspace/new-file">

Consider the workspace contains file _findings.txt_ with content:

```
finding 1

# Additional findings

finding 2
```

</a>

We can verify the caption like this:

<a type="extension/runnable-region">

```markdown
<a type="workspace/existing-file-with-content" partial-match>

The file _findings.txt_ now contains `# Additional findings`.
</a>
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
