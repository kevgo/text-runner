# Creating a file

- the name of the file is provided as _emphasized_ or **bold** text within the anchor tag
- the content of the file is provided as a code block with one or three backticks
- TextRunner creates the file in the workspace

#### Example

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="create-file">
_test.txt_ with content `foo`
</a>
```
</a>

- or -

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="create-file">

**test.txt**

`​``txt
The file content goes here
`​``
</a>

```
</a>


#### More info

- [feature specs](../../features/actions/built-in/create-file/create-file.feature)
- [source code](../../src/actions/create-file.ts)
```
