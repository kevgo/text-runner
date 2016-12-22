### Displaying a file from the source code tree in the tutorial

Sometimes you want to just display a file from the source code of your app in the tutorial.
For example to give your readers an idea how something works
without having them do it as part of the tutorial.


#### Example

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_verifyMatchesSourceCodeFile">
Your __tut-run.yml__ needs to contains this section:

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

- [feature specs](../../features/actions/built-in/verify-matches-source-code-file/verify-matches-source-code-file.feature)
- [source code](../../src/actions/built-in/verify-matches-source-code-file.ls)
