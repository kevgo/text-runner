# How TextRunner works

There are no limitations on how the Markdown must look like,
TextRunner can read and understand (with your help)
any Markdown structure including fenced code blocks,
embedded images, complex data in tables, bullet point lists,
as well as plain text in any human language.

To make a part of any Markdown file actionable by TextRunner,
wrap it in an `<a>` tag with class `tr_[action name]`.
As an example,
let's say a tutorial tells the reader to create a file `config.yml`
with the content `foo: bar`.
The markdown code of this tutorial might look something like this:

```markdown
## Creating a configuration file

Please create a file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
```

To make this part of the documentation executable,
surround it with an `<a>` tag that specifies that we want to create a file:

<a class="tr_runMarkdownInTextrun">

```markdown
## Creating a configuration file

<a class="tr_createFile">
Please create a file with the name __config.yml__ and the content:
`​``
foo: bar
`​``
</a>
```

</a>

The class `tr_createFile` tells TextRunner to run the `createFile` action here,
which creates a file in TextRunner's working directory.
The built-in implementation of the `createFile` action
takes the name of the file to create
from the bold or italic section inside the `<a>` tag,
and the content to write into the file from the code block.
Text outside of `<a>` tags is ignored by TextRunner.

If you run `text-run` on the command line to test this document,
TextRunner creates a file <a class="tr_verifyWorkspaceFileContent">_config.yml_
with the content `foo: bar`</a> in a subfolder of your current directory called `tmp`.
