import kebabCase from 'just-kebab-case'
import UnprintedUserError from '../errors/unprinted-user-error'
import AstNode from '../parsers/ast-node'
import AstNodeList from '../parsers/ast-node-list'
import { ActivityList } from './activity-list'

// Returns all activities contained in the given collection of AstNodeLists
export default function(ASTs: AstNodeList[], prefix: string): ActivityList {
  let result: ActivityList = []
  for (const AST of ASTs) {
    result = result.concat(extractActivities(AST, prefix))
  }
  return result
}

// Returns the activities contained in the given AstNodeList
function extractActivities(AST: AstNodeList, prefix: string): ActivityList {
  const result: ActivityList = []
  let activeNode: AstNode | null = null
  for (const node of AST) {
    if (isActiveBlockTag(node, prefix)) {
      ensureNoNestedActiveNode(node, activeNode)
      activeNode = node
      result.push({
        file: node.file,
        line: node.line,
        nodes: AST.getNodesFor(node),
        type: kebabCase(node.attributes[prefix])
      })
    }
    if (isActiveBlockEndTag(node, activeNode, prefix)) {
      activeNode = null
    }
  }
  return result
}

function ensureNoNestedActiveNode(node: AstNode, activeNode: AstNode | null) {
  if (activeNode) {
    throw new UnprintedUserError(
      `${node.file.platformified()}: block ${node.type || ''} (line ${
        node.line
      }) is nested in block ${activeNode.type} (line ${activeNode.line})`,
      node.file.platformified(),
      node.line
    )
  }
}

function isActiveBlockTag(node: AstNode, classPrefix: string): boolean {
  return !!node.attributes[classPrefix] && !node.type.endsWith('_close')
}

function isActiveBlockEndTag(
  node: AstNode,
  activeNode: AstNode | null,
  prefix: string
): boolean {
  if (!activeNode) {
    return false
  }
  return node.attributes[prefix] === activeNode.attributes[prefix]
}
