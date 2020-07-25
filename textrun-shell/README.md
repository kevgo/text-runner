# Text-Runner Shell Actions

This package provides [Text-Runner](https://github.com/kevgo/text-runner) allows
running short-lived (immediately ending) console commands. The execution waits
until the command is finished running.

- [run a short-lived console command](run_console_command.md) and enter data
  into it
- [verify the output of the last short-lived command](verify_console_command_output.md)

Text-Runner also allows running one long-running console command (called a
process) in the background, for example a server.

- [start and stop the long-running process](start_stop_process.md)
- [document parts of the process' output](verify_process_output.md)

Console commands execute in TextRunner's
[workspace directory](#interacting-with-the-local-filesystem).

With the option `--offline` given, text-run does not check outgoing links to
other websites.
