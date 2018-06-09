// @flow

import type { ActivityList } from './activity-list.js'

const AstNode = require('../parsers/ast-node.js')
const AstNodeList = require('../parsers/ast-node-list.js')
const kebabCase = require('just-kebab-case')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

// Returns all activities contained in the given collection of AstNodeLists
module.exports = function (ASTs: AstNodeList[], prefix: string): ActivityList {
  var result: ActivityList = []
  for (let AST of ASTs) {
    result = result.concat(extractActivities(AST, prefix))
  }
  return result
}

// Returns the activities contained in the given AstNodeList
function extractActivities (AST: AstNodeList, prefix: string): ActivityList {
  const result: ActivityList = []
  var activeNode: ?AstNode = null
  for (let node of AST) {
    if (isActiveBlockTag(node, prefix)) {
      ensureNoNestedActiveNode(node, activeNode)
      activeNode = node
      result.push({
        type: kebabCase(node.attributes[prefix]),
        file: node.file,
        line: node.line,
        nodes: AST.getNodesFor(node)
      })
    }
    if (isActiveBlockEndTag(node, activeNode, prefix)) {
      activeNode = null
    }
  }
  return result
}

function ensureNoNestedActiveNode (node: AstNode, activeNode: ?AstNode) {
  if (activeNode) {
    throw new UnprintedUserError(
      `${node.file}: block ${node.type || ''} (line ${
        node.line
      }) is nested in block ${activeNode.type} (line ${activeNode.line})`,
      node.file,
      node.line
    )
  }
}

function isActiveBlockTag (node: AstNode, classPrefix: string): boolean {
  return !!node.attributes[classPrefix] && !node.type.endsWith('_close')
}

function isActiveBlockEndTag (
  node: AstNode,
  activeNode: ?AstNode,
  prefix: string
): boolean {
  if (!activeNode) return false
  return node.attributes[prefix] === activeNode.attributes[prefix]
}
