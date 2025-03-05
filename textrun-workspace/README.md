# Text-Runner Actions for the Text-Runner test workspace

Some Text-Runner actions create files and folders on disk. These files and
folders get created in a temporary directory called the `workspace`. This
package provides [Text-Runner](https://github.com/kevgo/text-runner) actions for
working with this Text-Runner workspace.

### installation

<a type="npm/install">

```
npm i -D textrun-workspace
```

</a>

or

<a type="npm/install">

```
yarn i -D textrun-workspace
```

</a>

### working-dir

The <b type="action/name-full">workspace/working-dir</b> action changes the
current working directory of the test runner to the given directory inside the
workspace. As an example, consider your repository contains a
<b type="workspace/new-directory">examples</b> folder. Your can make can change
into it

<a type="extension/runnable-region">

```html
Create a
<code type="workspace/new-directory">scripts</code>
folder. Now you can change into it via this Markdown code:
<code type="workspace/working-dir">foo</code>
```

</a>

### create-directory

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

### create-file

The <b type="action/name-full">workspace/new-file</b> action creates a file in
the workspace. This action assumes that the documentation writes the filename in
_emphasized_ or **bold** text, or inside a "filename" attribute, and the file
content is a code block with one or three backticks. As an example, consider the
following documentation snippet:

<a type="extension/runnable-region">

```markdown
<a type="workspace/new-file">Please create a file _apples.txt_ with the content
`Fuji`.</a>
```

</a>

When executing the documentation, Text-Runner will create a file with name
<a type="workspace/existing-file">_apples.txt_ and content `Fuji`</a>.
Alternatively, the documentation could also read like this:

<a type="extension/runnable-region">

````markdown
<a type="workspace/new-file">

Please create a file with name **more-apples.txt** and the content:

```
Gala
```

</a>
````

</a>

Similarly, Text-Runner will create a file
<a type="workspace/existing-file">_more-apples.txt_ with content `Gala`</a>.

### directory

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

### file-content

The <b type="action/name-full">workspace/existing-file</b> action verifies that
a file with the given name exists and has the given content. This action assumes
that the documentation contains the filename as _emphasized_ or **strong** text
and the file content as a code block with single or triple backticks. As an
example, consider the following documentation snippet:

<a type="extension/runnable-region">

```markdown
Assuming a file <a type="workspace/new-file">_hello.txt_ with content
`hello world`</a>, we can verify it via this action:

<a type="workspace/existing-file">The file _hello.txt_ now contains
`hello world`.</a>
```

### specifying the directory

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

<a type="workspace/existing-file">

When executing the documentation, Text-Runner will create a file
_subdir/apples.txt_ and content `Boskoop`

</a>.
