// @flow

const AstNode = require('../../ast-node.js')
const { cyan } = require('chalk')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = class OpenTagTracker {
  nodes: AstNode[]

  constructor () {
    this.nodes = []
  }

  add (node: AstNode) {
    if (this.has(node.type)) {
      const existingNode = this.pop(node.type)
      throw new UnprintedUserError(
        `this active block is nested inside another active block of type ${cyan(
          existingNode.attributes['textrun']
        )} on line ${cyan(existingNode.line)}`,
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
    if (this.nodes.length === 0) {
      throw new Error(
        `OpenTagTracker is empty while trying to pop '${expectedNodeType}'`
      )
    }
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const result = this.nodes[i]
      if (result.type !== expectedNodeType) continue
      this.nodes.splice(i, 1)
      return result
    }
    throw new Error(`OpenTagTracker does not have node '${expectedNodeType}'`)
  }
}
