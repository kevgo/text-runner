# Configuration

You can configure TextRunner via command-line options or a configuration file.

## Creating a configuration file

To scaffold a config file, open a terminal, go to the folder where you want to
configure TextRunner, and run:

<pre type="shell/command">
$ text-run setup
</pre>

This creates a configuration file called <a type="workspace/existing-file">
**text-run.yml** that looks like this:

```yml
# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: "**/*.md"

# black-list of files not to test
# applied after the white-list above.
exclude: []

# the formatter to use (detailed, dot, progress, summary)
format: detailed

# regex patterns for link targets to ignore
ignoreLinkTargets: []

# Define which folders of your Markdown source get compiled to HTML
# and published under a different URL path.
#
# In this example, the public URL "/blog/foo"
# would be hosted as "post/foo.md":
# publications:
#   - localPath: /posts/
#     publicPath: /blog
#     publicExtension: ''

# Name of the default filename in folders.
# If you set this, and a link points to a folder,
# Text-Runner assumes the link points to the default file in that folder.
# defaultFile: index.md

# prefix that makes anchor tags active regions
regionMarker: type

# whether to display/emit skipped activities
showSkipped: false

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
systemTmp: false

# whether to verify online files/links (warning: this makes tests flaky)
online: false

# whether to delete all files in the workspace folder before running the tests
emptyWorkspace: true
```

</a>

## Using a custom configuration file

By default Text-Runner uses a file `text-run.yml` as the configuration file. You
can tell it to use another configuration file with the `--config` command-line
switch:

```
$ text-run --config=my-config.yml
```

<hr>

Read more about:

- the [built-in actions](built-in-actions.md)
- writing your own [user-defined actions](user-defined-actions.md)
- [installing](installation.md) TextRunner
