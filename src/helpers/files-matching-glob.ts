import AbsoluteFilePath from '../domain-model/absolute-file-path.js'
import glob from 'glob'

module.exports = function(expression: string): AbsoluteFilePath[] {
  return glob
    .sync(expression)
    .sort()
    .map(file => new AbsoluteFilePath(file))
}
