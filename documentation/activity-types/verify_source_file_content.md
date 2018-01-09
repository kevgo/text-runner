### Displaying a file from the source code tree in the documentation

Sometimes you want to just display a file from the source code of your app in the documentation.
For example to give your readers an idea how something works
without having them do it as part of the tutorial.


#### Simple Example

<a class="tr_createFile">
Let's say you have a file __hello.txt__ in your code base
with the content `hello world`.
</a>
You can display its content in your documentation via this active block:

<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_verifySourceFileContent">
Your __hello.txt__ file needs to contains this section:

`​``
hello world
`​``
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/verify-source-file-content/verify-source-file-content.feature)
- [source code](../../src/activity-types/verify-source-file-content.js)
