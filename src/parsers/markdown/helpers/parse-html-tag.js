// @flow

const parseHtmlAttributes = require('./parse-html-attributes.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

const attrRE = /<(\/?\w+)\s*(.*)>/

module.exports = function (
  html: string,
  filepath: string,
  line: number
): [string, { [string]: string }] {
  var matches = html.match(attrRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot parse HTML tag: '${html}'`,
      filepath,
      line
    )
  }
  return [matches[1], parseHtmlAttributes(matches[2])]
}
