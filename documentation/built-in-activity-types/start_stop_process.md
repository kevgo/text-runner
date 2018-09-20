# Long-running console commands

To start a long-running process, use the `startConsoleCommand` action.
The test script continues while the started process keeps running in the background.
This can be used to start servers and then interact with them later.

You can wait until the process prints a given string with a `waitForOutput` block,
and stop the long-running process using a `stopCommand` block.

#### Example

<a textrun="run-markdown-in-textrun">

```markdown
<a textrun="start-process">

`​``
$ echo Enter your name: $ read foo
`​``
</a>

Wait until it is fully booted up ...

<a textrun="verify-process-output">

`​``
Enter your name
`​``
</a>

Interact with the server here ...

<a textrun="stop-process">
Stop the current process by hitting Ctrl-C
</a>
```

</a>

#### More info

- [feature specs](../../features/actions/built-in/start-stop-process/basic.feature)
- [source code](../../src/actions/start-process.ts)
