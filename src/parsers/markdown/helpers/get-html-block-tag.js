// @flow

const AbsoluteFilePath = require('../../../domain-model/absolute-file-path.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

const tagNameRE = /^<(\/?\w+).*>/

module.exports = function (
  html: string,
  file: AbsoluteFilePath,
  line: number
): string {
  var matches = html.match(tagNameRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot find tagname in HTML block: '${html}'`,
      file.platformified(),
      line
    )
  }
  return matches[1]
}
