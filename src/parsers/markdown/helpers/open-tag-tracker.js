// @flow

import type { AstNode } from '../../../ast-node.js'

const UnprintedUserError = require('../../../../../../errors/unprinted-user-error.js')

module.exports = class OpenTagTracker {
  nodes: { [string]: AstNode }

  constructor () {
    this.nodes = {}
  }

  add (node: AstNode) {
    if (this.has(node.type)) {
      throw new UnprintedUserError(
        `nested node: ${node.type}`,
        node.file,
        node.line
      )
    }
    this.nodes[node.type] = node
  }

  has (nodeType: string): boolean {
    return !!this.nodes[nodeType]
  }

  pop (nodeType: string): AstNode {
    const result = this.nodes[nodeType]
    if (!result) {
      throw new UnprintedUserError(
        `OpenTagTracker does not have node '${nodeType}'`
      )
    }
    delete this.nodes[nodeType]
    return result
  }
}
