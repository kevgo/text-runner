### verify that a file has the given content

Verifies that a file with the given name exists,
and has the given content.

- the file name is provided as _emphasized_ or __strong__ text
- the file content is provided as a code block with single or triple backticks


#### Example

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="create-file">
Assuming we have a file _hello.txt_ with content `hello world`,
</a>
we can verify it via this block:
<a textrun="verify-workspace-file-content">

_hello.txt_

`​``
hello world
`​``
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-workspace-file-content/verify-workspace-file-content.feature)
- [source code](../../src/actions/verify-workspace-file-content.js)
