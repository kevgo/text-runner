// @flow

import type { ActivityList } from '../4-activities/activity-list.js'

const AstNode = require('../../../parsers/ast-node.js')
const AstNodeList = require('../../../parsers/ast-node-list.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

type ActiveBlockInfo = {
  node: AstNode,
  endType: string
}

module.exports = function extractActivitiesFromASTs (
  ASTs: AstNodeList[],
  classPrefix: string
): ActivityList {
  var result: ActivityList = []
  for (let AST of ASTs) {
    result = result.concat(extractActivities(AST, classPrefix))
  }
  return result
}

function extractActivities (AST: AstNodeList, classPrefix: string) {
  const result: ActivityList = []
  var activeBlockInfo: ?ActiveBlockInfo = null // the currently active block
  for (let node of AST) {
    if (isActiveBlockStartTag(node, classPrefix)) {
      ensureNoNestedActiveNode(node, activeBlockInfo)
      result.push({
        type: node.attributes[classPrefix],
        file: node.file,
        line: node.line,
        nodes: AST.getNodesFor(node)
      })
    }
  }
  return result
}

function ensureNoNestedActiveNode (node: AstNode, active: ?ActiveBlockInfo) {
  if (active) {
    throw new UnprintedUserError(
      `Block ${node.type || ''} at is nested in block ${
        active.node.type
      } on line ${active.node.line}.`,
      node.file,
      node.line
    )
  }
}

function isActiveBlockStartTag (node: AstNode, classPrefix: string): boolean {
  return !!node.attributes[classPrefix]
}
