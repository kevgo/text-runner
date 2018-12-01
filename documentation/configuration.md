# Configuration

You can configure TextRunner via command-line options or a configuration file.

## Creating a configuration file

To scaffold a config file, open a terminal,
go to the folder where you want to configure TextRunner, and run:

<a textrun="run-console-command">

```
$ text-run setup
```

</a>

This creates a configuration file called
<a textrun="verify-workspace-file-content">
**text-run.yml** that looks like this:

```yml
# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: '**/*.md'

# black-list of files not to test
# This is applied after the white-list above.
exclude: ''

# the formatter to use (detailed, dot)
format: detailed

# Define which folders of your Markdown source get compiled to HTML
# and published under a different URL path.
#
# In this example, the public URL "/blog/foo"
# is hosted as "post/foo.md":
# publications:
#   - localPath: /posts/
#     publicPath: /blog
#     publicExtension: ''

# Name of the default filename in folders.
# If this setting is given, and a link points to a folder,
# the link is assumed to point to the default file in that folder.
# defaultFile: index.md

# prefix that makes anchor tags active regions
classPrefix: textrun

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
```

</a>

## Using a custom configuration file

By default Text-Runner uses a file `text-run.yml` as the configuration file.
You can tell it to use another configuration file with the `--config` command-line switch:

```
$ text-run --config my-config.yml
```

<hr>

Read more about:

- the [built-in activity types](built-in-activity-types)
- writing your own [user-defined activities](user-defined-activities.md)
- [installing](installation.md) TextRunner
