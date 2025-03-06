import { UserError } from "../errors/user-error.js"
import { Node, NodeScaffoldDataReadonly } from "./node.js"

export class NodeList extends Array<Node> {
  /** Creates a new ast.NodeList containing an Node scaffoldedd from the given data */
  static scaffold(data: NodeScaffoldDataReadonly = {}): NodeList {
    const result = new NodeList()
    result.push(Node.scaffold(data))
    return result
  }

  /** Returns whether this ast.NodeList contains a node of the given type. */
  hasNodeOfType(nodeType: string): boolean {
    const types = [nodeType]
    types.push(nodeType + "_open")
    return this.some(node => types.includes(node.type))
  }

  /**
   * provides exactly one node matching any of the given types,
   * multiple or zero matches cause an exception
   */
  nodeOfTypes(...nodeTypes: string[]): Node {
    const nodes = this.nodesOfTypes(...nodeTypes)
    if (nodes.length > 1) {
      throw new UserError(
        `Found ${nodes.length} nodes of type '${nodeTypes.join("/")}'`,
        "The nodeOfTypes method expects to find only one matching node, but it found multiple.",
        nodes[0].location
      )
    }
    if (nodes.length === 0) {
      const msg = `found no nodes of type '${nodeTypes.join("/")}'`
      let guidance = "The node types in this list are: "
      guidance += this.nodeTypes().join(", ")
      throw new UserError(msg, guidance, this[0].location)
    }
    return nodes[0]
  }

  /**
   * Assuming the given Node is an opening node,
   * returns all nodes until it closes.
   */
  nodesFor(openingNode: Node): NodeList {
    if (openingNode == null) {
      throw new UserError(
        "no Node given",
        `Somebody called the Text-Runner API method "NodeList.getNodesFor()" without an argument.
This method provides all AST nodes until the given AST node closes.
This callstack should point you to the problem:

${new Error().stack}`
      )
    }
    let index = this.indexOf(openingNode)
    if (index === -1) {
      throw new UserError(
        `node '${openingNode.type}' not found in list`,
        "This ast.NodeList does not contain the given node.",
        openingNode.location
      )
    }
    const result = new NodeList()
    if (!openingNode.isOpeningNode()) {
      result.push(openingNode)
      return result
    }
    const endType = openingNode.endType()
    let node: Node
    do {
      node = this[index]
      result.push(node)
      index += 1
    } while (node.type !== endType && index < this.length)
    return result
  }

  /** Returns the Nodes matching any of the given types. */
  nodesOfTypes(...nodeTypes: string[]): NodeList {
    const result = new NodeList()
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

  /** Returns all node types encountered in this list. */
  nodeTypes(): string[] {
    return this.map(node => node.type)
  }

  /** Adds a new Node with the given data to this list. */
  pushNode(data: NodeScaffoldDataReadonly): void {
    this.push(Node.scaffold(data))
  }

  /** Returns the concatenated textual content of all nodes in this list. */
  text(): string {
    return this.map(node => node.content)
      .filter(text => text)
      .join(" ")
  }

  /** Returns the textual content for the given node. */
  textInNode(astNode: Node): string {
    return this.nodesFor(astNode).reduce((acc, node) => acc + node.content, "")
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
    return this.textInNode(this.nodeOfTypes(...nodeTypes))
  }

  /**
   * Returns the text in the node that has one of the given types.
   * Expects that exactly one matching node exists, throws otherwise.
   */
  textInNodeOfTypes(...nodeTypes: string[]): string {
    const node = this.nodeOfTypes(...nodeTypes)
    const nodes = this.nodesFor(node)
    return nodes.text()
  }

  /** provides the text in the nodes of the given types */
  textInNodesOfType(...nodeTypes: string[]): string[] {
    for (const nodeType of nodeTypes) {
      if (!nodeType.endsWith("_open")) {
        nodeTypes.push(nodeType + "_open")
      }
    }
    return this.nodesOfTypes(...nodeTypes).map(node => this.textInNode(node))
  }
}
