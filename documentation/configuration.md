# Configuration

You can configure TextRunner via a configuration file.
To create one, open a terminal,
go to the folder where you want to configure TextRunner, and run:

<a textrun="run-console-command">

```
$ text-run setup
````
</a>

This creates a configuration file called
<a textrun="verify-workspace-file-content">
__text-run.yml__ that looks like this:

```yml
# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: '**/*.md'

# the formatter to use
format: detailed

# prefix that makes anchor tags active regions
classPrefix: 'textrun'

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
useSystemTempDirectory: false

# whether to skip tests that require an online connection
offline: false

# activity-type specific configuration
activityTypes:
  runConsoleCommand:
    globals: {}
````

</a>

<hr>

Read more about:
- the [built-in activity types](built-in-activity-types)
- writing your own [user-defined activities](user-defined-activities.md)
- [installing](installation.md) TextRunner

