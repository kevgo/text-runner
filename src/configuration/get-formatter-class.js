// @flow

const DetailedFormatter = require('../formatters/detailed-formatter.js')
const DotFormatter = require('../formatters/dot-formatter.js')
const Formatter = require('../formatters/formatter.js')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

module.exports = function getFormatterClass (
  name: string,
  def: typeof Formatter
): typeof Formatter {
  if (name === 'dot') {
    return DotFormatter
  } else if (name === 'detailed') {
    return DetailedFormatter
  } else if (name) {
    throw new UnprintedUserError(`Unknown formatter: ${name}

Available formatters are: detailed, dot`)
  } else {
    return def
  }
}
