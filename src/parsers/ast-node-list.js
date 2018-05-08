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

  // Returns the node with the given type
  getNodeOfType (nodeType: string): ?AstNode {
    return this.find(node => node.type === nodeType)
  }

  // returns the textual content for the given node
  getTextFor (node: AstNode): string {
    return this.getNodesFor(node)
      .filter(node => node.type === 'text')
      .reduce((acc, node) => acc + node.content, '')
  }

  // returns whether this list contains a node of the given type
  hasNode (nodeType: string): boolean {
    const openType = nodeType + '_open'
    return this.some(node => node.type === nodeType || node.type === openType)
  }

  // returns the types of nodes in this list
  nodeTypes (): string[] {
    return this.map(node => node.type)
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

  // Returns the text in the nodes of the given types.
  // Exactly one node of the given types should exist.
  textInNode (...nodeTypes: string[]): string {
    var openingNodes = nodeTypes
      .map(nodeType => this.getNodeOfType(nodeType + '_open'))
      .filter(e => e)
    if (openingNodes.length > 1) {
      const node = openingNodes[0] || {} // to pacify the stupid typechecker
      throw new UnprintedUserError(
        `Found multiple matching nodes: ${openingNodes.join(', ')}`,
        node.file,
        node.line
      )
    }
    if (openingNodes.length === 0) {
      var msg = `Found no nodes of type '${nodeTypes.join('/')}'. `
      msg += 'The available node types are:\n'
      msg += this.nodeTypes().join(', ')
      throw new UnprintedUserError(msg, this[0].file, this[0].line)
    }
    // $FlowFixMe: stupid typechecker
    return this.getTextFor(openingNodes[0])
  }
}
