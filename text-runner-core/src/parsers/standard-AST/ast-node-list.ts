import { UserError } from "../../errors/user-error"
import { AstNode, AstNodeScaffoldData } from "./ast-node"

export class AstNodeList extends Array<AstNode> {
  /** Creates a new AstNodeList containing an AstNode scaffoldedd from the given data */
  static scaffold(data: AstNodeScaffoldData = {}): AstNodeList {
    const result = new AstNodeList()
    result.push(AstNode.scaffold(data))
    return result
  }

  /**
   * Returns the AstNode matching any of the given types.
   * Only one result is expected,
   * multiple or zero matches cause an exception.
   */
  getNodeOfTypes(...nodeTypes: string[]): AstNode {
    const nodes = this.getNodesOfTypes(...nodeTypes)
    if (nodes.length > 1) {
      throw new UserError(
        `Found ${nodes.length} nodes of type '${nodeTypes.join("/")}'`,
        "The getNodeOfTypes method expects to find only one matching node, but it found multiple.",
        nodes[0].file,
        nodes[0].line
      )
    }
    if (nodes.length === 0) {
      const msg = `found no nodes of type '${nodeTypes.join("/")}'`
      let guidance = "The node types in this list are: "
      guidance += this.nodeTypes().join(", ")
      throw new UserError(msg, guidance, this[0].file, this[0].line)
    }
    return nodes[0]
  }

  /**
   * Assuming the given AstNode is an opening node,
   * returns all nodes until it closes.
   */
  getNodesFor(openingNode: AstNode): AstNodeList {
    if (openingNode == null) {
      throw new UserError("no Node given")
    }
    let index = this.indexOf(openingNode)
    if (index === -1) {
      throw new UserError(
        `node '${openingNode.type}' not found in list`,
        "This AstNodeList does not contain the given node.",
        openingNode.file,
        openingNode.line
      )
    }
    const result = new AstNodeList()
    if (!openingNode.isOpeningNode()) {
      result.push(openingNode)
      return result
    }
    const endType = openingNode.endType()
    let node: AstNode
    do {
      node = this[index]
      result.push(node)
      index += 1
    } while (node.type !== endType && index < this.length)
    return result
  }

  /** Returns the AstNodes matching any of the given types. */
  getNodesOfTypes(...nodeTypes: string[]): AstNodeList {
    const result = new AstNodeList()
    const expectedTypes: string[] = []
    for (const nodeType of nodeTypes) {
      expectedTypes.push(nodeType)
      expectedTypes.push(nodeType + "_open")
    }
    for (const node of this) {
      if (expectedTypes.includes(node.type)) {
        result.push(node)
      }
    }
    return result
  }

  /** Returns whether this AstNodeList contains a node of the given type. */
  hasNodeOfType(nodeType: string): boolean {
    const types = [nodeType]
    types.push(nodeType + "_open")
    return this.some(node => types.includes(node.type))
  }

  /** Returns all node types encountered in this list. */
  nodeTypes(): string[] {
    return this.map(node => node.type)
  }

  /** Adds a new AstNode with the given data to this list. */
  pushNode(data: AstNodeScaffoldData): void {
    this.push(AstNode.scaffold(data))
  }

  /** Returns the concatenated textual content of all nodes in this list. */
  text(): string {
    return this.map(node => node.content)
      .filter(text => text)
      .join(" ")
  }

  /** Returns the textual content for the given node. */
  textInNode(astNode: AstNode): string {
    return this.getNodesFor(astNode).reduce((acc, node) => acc + node.content, "")
  }

  /**
   * Returns the text in the node of the given types.
   * Expects that exactly one matching node exists,
   * throws otherwise.
   */
  textInNodeOfType(...nodeTypes: string[]): string {
    for (const nodeType of nodeTypes) {
      if (!nodeType.endsWith("_open")) {
        nodeTypes.push(nodeType + "_open")
      }
    }
    return this.textInNode(this.getNodeOfTypes(...nodeTypes))
  }

  /**
   * Returns the text in the node that has one of the given types.
   * Expects that exactly one matching node exists, throws otherwise.
   */
  textInNodeOfTypes(...nodeTypes: string[]): string {
    const node = this.getNodeOfTypes(...nodeTypes)
    const nodes = this.getNodesFor(node)
    return nodes.text()
  }

  /**
   * Returns the text in the nodes of the given types.
   */
  textInNodesOfType(...nodeTypes: string[]): string[] {
    for (const nodeType of nodeTypes) {
      if (!nodeType.endsWith("_open")) {
        nodeTypes.push(nodeType + "_open")
      }
    }
    return this.getNodesOfTypes(...nodeTypes).map(node => this.textInNode(node))
  }
}
