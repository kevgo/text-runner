// @flow

const fs = require('fs')

module.exports = function (dirname :string) :boolean {
  try {
    const info = fs.statSync(dirname)
    return info.isDirectory()
  } catch (e) {
    return false
  }
}
