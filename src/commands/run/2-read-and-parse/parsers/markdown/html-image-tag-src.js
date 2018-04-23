// @flow

import type { AstNode } from '../../ast-node.js'

const UnprintedUserError = require('../../../../../errors/unprinted-user-error.js')

module.exports = function htmlImageTagSrc (node: AstNode): string {
  if (!node.html) {
    throw new UnprintedUserError(`Error parsing html`)
  }
  const matches = node.html.match(/<img.*src="([^"]*)".*>/)
  if (!matches) {
    throw new UnprintedUserError(
      'image tag without src attribute:',
      node.filepath,
      node.line
    )
  }
  return matches[1]
}
