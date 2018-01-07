# Built-in Actions

TextRunner provides a number of built-in actions
for activities typically performed in software documentation.


## Filesystem

All file system actions happen inside a special directory called the _workspace_.
This directory is located in `./tmp` unless [configured otherwise](configuration.md).

* [change the current working directory](activity-types/cd.md)
* [create a directory](activity-types/create_directory.md)
* [create a file](activity-types/create_file.md)
* [verify a directory exists](activity-types/verify_workspace_contains_directory.md)
* [verify a file with given name and content exists](activity-types/verify_workspace_file_content.md)


## Verify the Git repo that contains the documentation

* [display the content of a file in the Git repo](activity-types/verify_source_file_content.md)
* [link to a directory in the Git repo](activity-types/verify_source_contains_directory.md)


## Console commands

Console commands also happen in TextRunner's [workspace directory](#filesystem).
* [run a console command](activity-types/run_console_command.md)
* [start and stop long-running console commands](activity-types/start_stop_console_command.md)
* [verify the output of the last console command](activity-types/verify_run_console_command_output.md)


## Running source code

* [run Javascript code](activity-types/run_javascript.md)


## Other actions

* [required NodeJS version](activity-types/minimum-node-version.md)
* [verify NPM installation instructions](activity-types/verify_npm_install.md)
* [verify global command provided by NPM module](activity-types/verify_npm_global_command.md)

With the option `--offline` given, text-run does not check outgoing links to other websites.


<hr>

Read more about:
- writing your own [user-defined activity types](user-defined-activity-types.md)
