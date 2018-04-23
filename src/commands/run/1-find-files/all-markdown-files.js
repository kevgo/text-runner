// @flow

const glob = require('glob')

// Returns all the markdown files in the current working directory
module.exports = function allMarkdownFiles (configuredFiles: string): string[] {
  var files = glob.sync(configuredFiles)
  files = files.filter(file => !file.includes('node_modules')).sort()
  return files
}
