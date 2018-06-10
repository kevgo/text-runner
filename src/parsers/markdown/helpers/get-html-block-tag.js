// @flow

const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

const tagNameRE = /^<(\/?\w+).*>/

module.exports = function (html: string, file: string, line: number): string {
  var matches = html.match(tagNameRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot find tagname in HTML block: '${html}'`,
      file,
      line
    )
  }
  return matches[1]
}
