# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner)
actions for running console commands. These commands run in Text-Runner's
[workspace directory](#interacting-with-the-local-filesystem).

### Short-lived commands

Use the <code textrun="action-name">shell/exec</code> action to run a shell
command and wait until it finishes:

<a textrun="run-in-textrun">

```html
<pre textrun="shell/exec">
$ echo Hello world!
</pre>
```

</a>

This action ignores dollar signs at the beginning of lines that indicate a shell
prompt. You can document the expected output of the shell command:

<a textrun="run-in-textrun">

```html
<pre textrun="shell/exec-output">
Hello world!
</pre>
```

</a>

### Long-running processes

Long-running processes, for example web or database servers, keep running while
Text-Runner continues testing the document. To start a long-running process, use
the <code textrun="action-name">shell/start</code> action:

<a textrun="run-in-textrun">

```html
<pre textrun="shell/start">
read
</pre>
```

</a>

The <code textrun="action-name">shell/server-output</code> action waits until
the server prints the given output. The <code textrun="action-name">

[start and stop a server](start_stop_server.md) -
[document parts of the server's output](verify_process_output.md) With the
option `--offline` given, text-run does not check outgoing links to other
websites.

### User input
