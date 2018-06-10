### verify that the source code contains a directory

The `verifySourceContainsDirectory` action checks links to folders
in your source code.

#### Example

<a textrun="create-directory">
Say your source code contains a folder `foo`.
</a>
You can reference this folder in your documentation via this active block:
<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="verify-source-contains-directory">
Check out the [foo](foo) directory for a working example.
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-source-contains-directory/verify-source-contains-directory.feature)
- [source code](../../src/actions/verify-source-contains-directory.js)
