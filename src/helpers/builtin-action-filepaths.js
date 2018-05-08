// @flow

const glob = require('glob')
const path = require('path')

module.exports = function builtinActionFilenames (): string[] {
  return glob.sync(path.join(__dirname, '..', 'actions', '*.js'))
}
