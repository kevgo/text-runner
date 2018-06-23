// @flow

const fs = require('fs')

module.exports = function createConfiguration () {
  fs.writeFileSync(
    './text-run.yml',
    `# white-list for files to test
# This is a glob expression, see https://github.com/isaacs/node-glob#glob-primer
# The folder "node_modules" is already excluded.
# To exclude the "vendor" folder: '{,!(vendor)/**/}*.md'
files: '**/*.md'

# the formatter to use
format: detailed

# If you compile Markdown to HTML,
# this option specifies how links to local Markdown files look like
# in your transpiled HTML.
# - direct: link "1.md" points to file 1.md
# - html: link "1.html" points to file 1.md
# - url-friendly: link "1" points to file 1.md
linkFormat: direct

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
    globals: {}`
  )
}
