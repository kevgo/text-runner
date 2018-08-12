// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const glob = require('glob')

// Returns all the markdown files in the current working directory
module.exports = function (configuredFiles: string): AbsoluteFilePath[] {
  var files = glob.sync(configuredFiles)
  files = files.filter(file => !file.includes('node_modules')).sort()
  return files
}
