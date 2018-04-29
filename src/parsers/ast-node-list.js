// @flow

const AstNode = require('./ast-node.js')
const endTypeFor = require('./helpers/end-type-for.js')
const Iterable = require('iterable.flow')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

module.exports = class AstNodeList extends Iterable.Sync<AstNode> {
  nodes: Array<AstNode>

  constructor () {
    super()
    this.nodes = []
  }

  concat (list: AstNodeList) {
    this.nodes = this.nodes.concat(list.nodes)
  }

  getNodesFor (openingNode: AstNode): AstNodeList {
    if (!openingNode.isOpeningNode()) {
      throw new Error('openingNode must be an opening node')
    }
    var index = this.nodes.indexOf(openingNode)
    if (index === -1) throw new UnprintedUserError('node not found in list')
    const endType = endTypeFor(openingNode.type)
    const result = new AstNodeList()
    do {
      var node = this.nodes[index]
      result.push(node)
      index += 1
    } while (node.type !== endType)
    return result
  }

  // returns the textual content for the given node
  getTextFor (node: AstNode): string {
    return this.getNodesFor(node)
      .nodes.filter(node => node.type === 'text')
      .reduce((acc, node) => acc + node.content, '')
  }

  push (node: AstNode) {
    this.nodes.push(node)
  }

  pushData (data: {
    type: string,
    tag: string,
    file: string,
    line: number,
    content: string,
    attributes: { [string]: string }
  }) {
    this.nodes.push(new AstNode(data))
  }

  // Adds a new AstNode containing the given data to this list
  scaffold (data: Object = {}) {
    this.nodes.push(AstNode.scaffold(data))
  }

  * iterator (): Iterable.Iterator<AstNode> {
    for (const node of this.nodes) {
      yield node
    }
  }
}
