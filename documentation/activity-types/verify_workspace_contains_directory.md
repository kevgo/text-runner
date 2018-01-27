### verify that the test workspace contains a directory

The `verifyWorkspaceContainsDirectory` action checks links to folders in your source code.


#### Example

Assuming your test workspace contains a
<a textrun="createDirectory">`foo`</a>
directory,
you can use this code to verify that it exists:

<a textrun="runMarkdownInTextrun">
```markdown
<a textrun="verifyWorkspaceContainsDirectory">
  Now your workspace has a `foo` directory.
</a>
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/verify-source-contains-directory/verify-source-contains-directory.feature)
- [source code](../../src/activity-types/verify-source-contains-directory.js)
