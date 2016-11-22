# Long-running console commands

To start a long-running process, use the `startConsoleCommand` action.
The test script continues while the started process keeps running in the background.
This can be used to start servers and then interact with them later.

You can wait until the process prints a given string with a `waitForOutput` block,
and stop the long-running process using a `stopCommand` block.

<a class="tutorialRunner_runMarkdownInTutrun">
```markdown
<a class="tutorialRunner_startConsoleCommand">

`​``
$ read foo
`​``
</a>

... interact with the server here ...

<a class="tutorialRunner_stopConsoleCommand">
Stop the current process by hitting Ctrl-C
</a>
```
</a>
