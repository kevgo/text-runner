// @flow

const stripRE = /^\//

module.exports = function (text: string): string {
  return text.replace(stripRE, '')
}
