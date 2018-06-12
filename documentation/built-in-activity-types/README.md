# Built-in Actions

TextRunner provides a number of built-in actions
for activities typically performed in software documentation.


## Verify the contents from the documented Git repo

* [display the content of a file in the Git repo](verify_source_file_content.md)
* verify a directory in the Git repo by linking to it


## Interacting with the local filesystem

All file system actions happen inside a special directory called the _workspace_.
This directory is located in `./tmp` unless [configured otherwise](../configuration.md).

* [change the current working directory](cd.md)
* [create a directory](create_directory.md)
* [create a file](create_file.md)
* [verify a directory exists](verify_workspace_contains_directory.md)
* [verify a file with given name and content exists](verify_workspace_file_content.md)


## Running console commands

Text-Runner allows running short-lived (immediately ending) console commands.
The execution waits until the command is finished running.
* [run a short-lived console command](run_console_command.md)
  and enter data into it
* [verify the output of the last short-lived command](verify_console_command_output.md)

Text-Runner also allows running one long-running console command
(called a process) in the background,
for example a server.
* [start and stop the long-running process](start_stop_process.md)
* [document parts of the process' output](verify_process_output.md)

Console commands execute in TextRunner's
[workspace directory](#interacting-with-the-local-filesystem).


## Executing source code

* [run Javascript code](run_javascript.md)


## Other actions

* [verify NPM installation instructions](verify_npm_install.md)
* [verify global command provided by NPM module](verify_npm_global_command.md)

With the option `--offline` given, text-run does not check outgoing links to other websites.


<hr>

Read more about:
- writing your own [user-defined activities](../user-defined-activities.md)
