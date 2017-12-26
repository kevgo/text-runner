// @flow

const fs = require('fs')
const glob = require('glob')

module.exports = function (globExpression :string) {
  try {
    glob.sync(globExpression)
        .any((it) => it.endsWith('.md') && fs.statSync(it).isFile())
  } catch (e) {
    return false
  }
}
