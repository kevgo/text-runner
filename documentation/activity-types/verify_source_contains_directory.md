### verify that the source code contains a directory

The `verifySourceContainsDirectory` action checks links to folders
in your source code.

#### Example

<a textrun="createDirectory">
Say your source code contains a folder `foo`.
</a>
You can reference this folder in your documentation via this active block:
<a textrun="runMarkdownInTextrun">
```markdown
<a textrun="verifySourceContainsDirectory">
Check out the [foo](foo) directory for a working example.
</a>
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/verify-source-contains-directory/verify-source-contains-directory.feature)
- [source code](../../src/activity-types/verify-source-contains-directory.js)
