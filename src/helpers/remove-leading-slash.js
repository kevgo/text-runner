// @flow

const path = require('path')

module.exports = function (text: string): string {
  if (!text.startsWith(path.sep)) return text
  return text.slice(1)
}
