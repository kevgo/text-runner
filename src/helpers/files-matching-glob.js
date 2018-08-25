// @flow

const AbsoluteFilePath = require('../domain-model/absolute-file-path.js')
const glob = require('glob')

module.exports = function (expression: string): AbsoluteFilePath[] {
  return glob
    .sync(expression)
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
