# Long-running console commands

To start a long-running process, use the `startConsoleCommand` action.
The test script continues while the started process keeps running in the background.
This can be used to start servers and then interact with them later.

You can wait until the process prints a given string with a `waitForOutput` block,
and stop the long-running process using a `stopCommand` block.



#### Example
<a class="textRunner_runMarkdownInTextrun">
```markdown
<a class="textRunner_startConsoleCommand">

`​``
$ read foo
`​``
</a>

... interact with the server here ...

<a class="textRunner_stopConsoleCommand">
Stop the current process by hitting Ctrl-C
</a>
```
</a>


#### More info

- [feature specs](../../features/actions/built-in/start-stop-console-command/basic.feature)
- [source code](../../src/actions/built-in/start-console-command.ls)
