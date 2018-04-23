// @flow

const glob = require('glob')

// Returns all the markdown files in this directory and its children
module.exports = function markdownFilesInDir (dirName: string) {
  const files = glob.sync(`${dirName}/**/*.md`)
  return files.filter(file => !file.includes('node_modules')).sort()
}
