# Built-in Actions

TextRunner provides a number of built-in actions for activities typically
performed in software documentation.

## Verify the contents from the documented Git repo

- [display the content of a file in the Git repo](verify_source_file_content.md)
- verify a directory in the Git repo by linking to it

## Interacting with the local filesystem

All file system actions happen inside a special directory called the
_workspace_. This directory is located in `./tmp` unless
[configured otherwise](../configuration.md).

- [change the current working directory](cd.md)
- [create a directory](create_directory.md)
- [create a file](create_file.md)
- [verify a directory exists](verify_workspace_contains_directory.md)
- [verify a file with given name and content exists](verify_workspace_file_content.md)

<hr>

Read more about:

- writing your own [user-defined actions](../user-defined-actions.md)
