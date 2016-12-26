# Creating a file

* the name of the file is provided as bold text within the anchor tag
* the content of the file is provided as a multi-line code block (surrounded with \`\`\`) within the anchor tag
* TextRunner creates the file in the workspace


#### Example

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

- [feature specs](../../features/actions/built-in/create-file/create-file.feature)
- [source code](../../src/actions/built-in/create-file.ls)
