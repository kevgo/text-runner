// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const glob = require('glob')

// Returns all the markdown files in this directory and its children
module.exports = function markdownFilesInDir (
  dirName: string
): AbsoluteFilePath[] {
  const files = glob.sync(`${dirName}/**/*.md`)
  return files
    .filter(file => !file.includes('node_modules'))
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
