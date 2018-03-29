### verify that the test workspace contains a directory

The `verifyWorkspaceContainsDirectory` action checks links to folders in your source code.


#### Example

Assuming your test workspace contains a
<a textrun="create-directory">`foo`</a>
directory,
you can use this code to verify that it exists:

<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="verify-workspace-contains-directory">
  Now your workspace has a `foo` directory.
</a>
```
</a>


#### More info

- [feature specs](../../features/activity-types/built-in/verify-source-contains-directory/verify-source-contains-directory.feature)
- [source code](../../src/activity-types/verify-source-contains-directory.js)
