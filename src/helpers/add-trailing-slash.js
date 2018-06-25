// @flow

const path = require('path')

module.exports = function (text: string): string {
  if (text.endsWith(path.sep)) return text
  return text + path.sep
}
