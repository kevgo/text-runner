# How TextRunner works

<!-- TODO: start with a simpler example, like converting a code block of JavaScript to <pre>. -->

To make a part of any Markdown file actionable by TextRunner, surround it with
in an HTML tag that has the attribute `type="[semantic meaning of the part]"`.
If you need an HTML tag that doesn't change the layout of your text, that's the
`<a>` tag. As an example, let's say a tutorial tells its reader to create a file
`config.yml` with the content `foo: bar` on their machine. The markdown code of
this tutorial might look something like this:

```markdown
## Creating a configuration file

Please create a file with the name _config.yml_ and the content: `foo: bar`
```

To make this part of the documentation executable, surround it with an `<a>` tag
that specifies that we want to create a file:

<a type="extension/run-region">

```markdown
## Creating a configuration file

<a type="workspace/new-file">

Please create a file with the name _config.yml_ and the content: `foo: bar`

</a>
```

</a>

TextRunner calls parts of text documents that are marked up like this _active
blocks_. The attribute `type="workspace/new-file"` tells TextRunner to run the
`workspace/new-file` action here, which creates a file in TextRunner's working
directory. The built-in implementation of the `create-file` action takes the
name of the file to create from a bold or italic section inside the `<a>` tag,
and the content to write into the file from a code block. Text outside of `<a>`
tags is ignored by TextRunner.

If you run `text-run` on the command line to test this document, TextRunner
creates a file <a type="workspace/file-content">_config.yml_ with the content
`foo: bar`</a> in the `tmp` subfolder of your current directory.

<hr>

Read more about:

- the other [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
- [configuring](configuration.md) TextRunner
