# Verify the output of the last console command

- checks that the last short-lived console command
  (run via [runConsoleCommand](run_console_command.md)
  contains the given output fragments
- the output can contain more content in between lines

#### Example

First, let's runs a console command:
<a textrun="run-markdown-in-textrun">
```markdown
<a textrun="run-console-command">
`​``
echo Hello world!
`​``
</a>

Now that it's finished, let's verify its output:
<a textrun="verify-console-command-output">
`​``
Hello world!
`​``
</a>
```
</a>

#### More info

- [feature specs](../../features/actions/built-in/verify-console-command-output/verify-console-command-output.feature)
- [source code](../../src/actions/verify-console-command-output.js)
