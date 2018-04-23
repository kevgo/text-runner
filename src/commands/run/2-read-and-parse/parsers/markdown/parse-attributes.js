// @flow

const UnprintedUserError = require('../../../../../errors/unprinted-user-error.js')

const attrRE = /<(\w+)\s+(.*)>/
const tupleRE = /([^=]+="[^"]*")/g

module.exports = function (
  html: string,
  filepath: string,
  line: number
): { [string]: string } {
  var matches = html.match(attrRE)
  if (!matches) {
    throw new UnprintedUserError(
      `cannot parse HTML attributes: '${html}'`,
      filepath,
      line
    )
  }
  matches = matches[2].match(tupleRE)
  if (!matches) return {}
  return matches.map(attr => attr.split('=', 2)).reduce(reducer, {}) || {}
}

function reducer (acc, attr) {
  const [key, value] = attr
  acc[key.trim()] = value.trim().replace(/"/g, '')
  return acc
}
