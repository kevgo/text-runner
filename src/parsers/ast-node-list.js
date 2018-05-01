// @flow

const AstNode = require('./ast-node.js')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

module.exports = class AstNodeList extends Array<AstNode> {
  getNodesFor (openingNode: AstNode): AstNodeList {
    if (!openingNode.isOpeningNode()) {
      throw new Error('openingNode must be an opening node')
    }
    var index = this.indexOf(openingNode)
    if (index === -1) throw new UnprintedUserError('node not found in list')
    const endType = openingNode.endType()
    const result = new AstNodeList()
    do {
      var node = this[index]
      result.push(node)
      index += 1
    } while (node.type !== endType)
    return result
  }

  // returns the textual content for the given node
  getTextFor (node: AstNode): string {
    return this.getNodesFor(node)
      .filter(node => node.type === 'text')
      .reduce((acc, node) => acc + node.content, '')
  }

  pushData (data: {
    type: string,
    tag: string,
    file: string,
    line: number,
    content: string,
    attributes: { [string]: string }
  }) {
    this.push(new AstNode(data))
  }

  // Adds a new AstNode containing the given data to this list
  scaffold (data: Object = {}) {
    this.push(AstNode.scaffold(data))
  }
}
