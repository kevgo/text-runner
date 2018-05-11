// @flow

const AstNode = require('../../ast-node.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = class OpenTagTracker {
  nodes: AstNode[]

  constructor () {
    this.nodes = []
  }

  add (node: AstNode) {
    if (this.has(node.type)) {
      throw new UnprintedUserError(
        `nested node: ${node.type}`,
        node.file,
        node.line
      )
    }
    this.nodes.push(node)
  }

  has (nodeType: string): boolean {
    return this.nodes.some(node => node.type === nodeType)
  }

  peek (): AstNode {
    return this.nodes[this.nodes.length - 1]
  }

  pop (expectedNodeType: string): AstNode {
    const result = this.nodes.pop()
    if (!result) {
      throw new UnprintedUserError(
        `OpenTagTracker is empty while trying to pop '${expectedNodeType}'`
      )
    }
    if (result.type !== expectedNodeType) {
      throw new UnprintedUserError(
        `OpenTagTracker does not have node '${expectedNodeType}'`
      )
    }
    return result
  }
}
