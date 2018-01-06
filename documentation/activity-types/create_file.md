# Creating a file

* the name of the file is provided as _emphasized_ or __bold__ text within the anchor tag
* the content of the file is provided as a code block with one or three backticks
* TextRunner creates the file in the workspace


#### Example

<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_createFile">
_test.txt_ with content `foo`
</a>
```
</a>

- or -

<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_createFile">

__test.txt__

`​``txt
The file content goes here
`​``
</a>
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/create-file/create-file.feature)
- [source code](../../src/activity-types/create-file.js)
