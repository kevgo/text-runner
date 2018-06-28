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

# If you compile Markdown to HTML, this option specifies
# how links to local Markdown files look like in your transpiled HTML.
# - direct: link "1.md" points to file "1.md"
# - html: link "1.html" points to file "1.md"
# - url-friendly: link "1" points to file "1.md"
linkFormat: direct

# Define which folders of your Markdown source get compiled to HTML
# and published under a different URL path.
# Example:
#   /content/posts: /blog   # folder "content/posts" shows up under "/blog" in the compiled HTML
folderMapping:

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

