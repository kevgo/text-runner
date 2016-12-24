### verify that the test workspace contains a directory

The `verifyWorkspaceContainsDirectory` action checks links to folders in your source code.


#### Example

Assuming your test workspace contains a
<a class="tutorialRunner_createDirectory">`foo`</a>
directory,
you can use this code to verify that it exists:

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_verifyWorkspaceContainsDirectory">
  Now your workspace has a `foo` directory.
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-source-contains-directory/verify-source-contains-directory.feature)
- [source code](../../src/actions/built-in/verify-source-contains-directory.ls)
