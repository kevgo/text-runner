### Displaying a file from the source code tree in the test

Sometimes you want to just display a file from the source code of your app in the documentation.
For example to give your readers an idea how something works
without having them do it as part of the tutorial.


#### Example

<a class="tr_runMarkdownInTextrun">
```markdown
<a class="tr_verifySourceFileContent">
Your __text-run.yml__ needs to contains this section:

`​``
actions:

  runConsoleCommand:
    globals:
      tool: 'public/tool'
`​``

The
[global-tool](examples/global-tool)
folder contains a working version.
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/verify-source-file-content/verify-source-file-content.feature)
- [source code](../../src/actions/built-in/verify-source-file-content.ls)
