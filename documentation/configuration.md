# Configuration

You can configure TextRunner via a configuration file.
To create one, open a terminal,
<!-- TODO <a class="tr_cdIntoSetupExample">-->go to the folder<!-- </a> -->
where you want to configure TextRunner, and run:

<a class="tr_runConsoleCommand">

```
$ text-run setup
````
</a>

This creates a configuration file called
<a class="tr_verifyWorkspaceFileContent">
__text-run.yml__ that looks like this:

```yml
# white-list for files to test
files: '**/*.md'

# the formatter to use
format: detailed

# prefix that makes anchor tags active regions
classPrefix: 'tr_'

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
useTempDirectory: false

# action-specific configuration
actions:
  runConsoleCommand:
    globals: {}
````

</a>

<hr>

Read more about:
- the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
- [installing](installation.md) TextRunner

