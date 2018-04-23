// @flow

const fs = require('fs')

module.exports = function hasDirectory (dirname: string): boolean {
  try {
    return fs.statSync(dirname).isDirectory()
  } catch (e) {
    return false
  }
}
