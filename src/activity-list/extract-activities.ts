import kebab from '@queso/kebab-case'
import { UnprintedUserError } from '../errors/unprinted-user-error'
import { AstNode } from '../parsers/ast-node'
import { AstNodeList } from '../parsers/ast-node-list'
import { ActivityList } from './activity-list'

/**
 * Returns all activities contained in the given collection of AstNodeLists.
 *
 * @param ASTs
 * @param attributeName the name of the attribute that denotes active blocks
 */
export function extractActivities(
  ASTs: AstNodeList[],
  attributeName: string
): ActivityList {
  let result: ActivityList = []
  for (const AST of ASTs) {
    result = result.concat(extractActivitiesFromNode(AST, attributeName))
  }
  return result
}

/**
 * Returns the activities contained in the given AstNodeList
 * @param AST
 * @param attributeName the name of the attribute that denotes active blocks
 */
function extractActivitiesFromNode(
  AST: AstNodeList,
  attributeName: string
): ActivityList {
  const result: ActivityList = []
  let activeNode: AstNode | null = null
  for (const node of AST) {
    if (isActiveBlockTag(node, attributeName)) {
      ensureNoNestedActiveNode(node, activeNode)
      activeNode = node
      result.push({
        actionName: kebab(node.attributes[attributeName]),
        file: node.file,
        line: node.line,
        nodes: AST.getNodesFor(node)
      })
    }
    if (isActiveBlockEndTag(node, activeNode, attributeName)) {
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
