### Displaying a file from the source code tree in the documentation

Sometimes you want to just display a file from the source code of your app in the documentation.
For example to give your readers an idea how something works
without having them do it as part of the tutorial.


#### Simple Example

<a textrun="create-file">
Let's say you have a file __hello.txt__ in your code base
with the content `hello world`.
</a>
You can display its content in your documentation via this active block:

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="verify-source-file-content">
Your __hello.txt__ file needs to contains this section:

`​``
hello world
`​``
</a>
```
</a>

- extracts the filename from the bold section
- extracts the expected file content from the fenced code block


#### Providing a base directory

The filename of the source code file is relative to the documentation file.
You can also provide a directory in which your file is located
via a link in the active block.

<a textrun="create-file">
Let's say you have a file __foo/bar/hello2.txt__ in your code base
with the content `hello again`.
</a>
You can display its content in your documentation via this active block:

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="verify-source-file-content">
Your __hello2.txt__ file in the [bar folder](foo/bar)
needs to contains this section:

`​``
hello again
`​``
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-source-file-content/verify-source-file-content.feature)
- [source code](../../src/actions/verify-source-file-content.js)
