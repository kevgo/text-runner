// @flow

const path = require('path')

const normalizeRE = new RegExp('[\\\\/]+', 'g')

module.exports = function (filepath: string): string {
  return filepath.replace(normalizeRE, path.sep)
}
