# Configuration

You can configure TextRunner via a configuration file.
To create one, open a terminal,
<a class="tr_cdIntoSetupExample">go to the folder</a>
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

* the `files` key describes via a glob function which files are executed by TextRunner.
  It automatically ignores hidden folders as well as `node_modules`.

* the `actions` section contains configuration information specific to actions.
  Please see the documentation for the respective action for more details.
