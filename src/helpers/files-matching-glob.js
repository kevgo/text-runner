// @flow

const glob = require('glob')

module.exports = function filesMatchingGlob (expression: string): string[] {
  return glob.sync(expression).sort()
}
