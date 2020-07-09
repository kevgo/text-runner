### verify that a file has the given content

Verifies that a file with the given name exists and has the given content.

- the file name is _emphasized_ or **strong** text
- the file content a code block with single or triple backticks

#### Example

```html
<a textrun="create-file">
  Assuming we have a file _hello.txt_ with content `hello world`,
</a>

we can verify it via this block:

<a textrun="verify-workspace-file-content">
  _hello.txt_ `hello world`
</a>
```

#### More info

- [feature specs](../../features/actions/built-in/verify-workspace-file-content/verify-workspace-file-content.feature)
- [source code](../../src/actions/built-in/verify-workspace-file-content.ts)
