### verify that a file has the given content

Verifies that a file with the given name exists,
and has the given content.


#### Example

<a class="tr_createFile">
Assuming we have a file __hello.txt__ with content `hello world`,
</a>
we can verify it via this block:


<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_verifyFileContent">

__hello.txt__

`​``
hello world
`​``
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-file-content/verify-file-content.feature)
- [source code](../../src/actions/built-in/verify-file-content.ls)
