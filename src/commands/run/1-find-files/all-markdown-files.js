// @flow

const glob = require('glob')

// Returns all the markdown files in the current working directory
module.exports = function allMarkdownFiles (configuredFiles: string): string[] {
  var files = glob.sync(configuredFiles)
  files = files.filter(file => !file.includes('node_modules')).sort()
  // if (this.filename != null) {
  //   files = files.filter(file => !file === this.filename)
  // }
  return files
}
