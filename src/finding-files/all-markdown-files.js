// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const glob = require('glob')

// Returns all the markdown files in the current working directory
module.exports = function (configuredFiles: string): AbsoluteFilePath[] {
  return glob
    .sync(configuredFiles)
    .filter(file => !file.includes('node_modules'))
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
