// @flow

const DetailedFormatter = require('../formatters/detailed-formatter.js')
const DotFormatter = require('../formatters/dot-formatter.js')
const Formatter = require('../formatters/formatter.js')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

module.exports = function getFormatterClass (name: string): typeof Formatter {
  if (name === 'dot') {
    return DotFormatter
  } else if (name === 'detailed') {
    return DetailedFormatter
  } else if (typeof name === 'function') {
    return name
  } else {
    throw new UnprintedUserError('Unknown formatter: ' + name)
  }
}
