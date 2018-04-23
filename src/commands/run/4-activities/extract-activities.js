// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
import type { AstNode } from '../2-read-and-parse/ast-node.js'
import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'

const getTagType = require('../../../helpers/get-tag-type.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = function extractActivities (
  ASTs: AstNodeList[],
  classPrefix: string
): ActivityList {
  const blockTypeRegex = new RegExp(` ${classPrefix}="([^"]+)"`)

  const result: ActivityList = []
  var activeTagType = '' // if we are inside an active block, contains the tag type for that block, e.g. "a" or "code"
  var blockType = '' // name of the currently processed block type, e.g. "check-image"
  var nodesForCurrentBlock: AstNodeList = [] // AST nodes that are inside the active block

  for (let AST: AstNodeList of ASTs) {
    for (let node: AstNode of AST) {
      console.log(node)
      if (isActiveBlockStartTag(node, blockTypeRegex)) {
        console.log('found active node:', node)
        if (activeTagType !== '') {
          throw new UnprintedUserError(
            `Block ${node.content || ''} is nested in another 'textrun' block.`,
            node.filepath,
            node.line
          )
        }
        activeTagType = getTagType(node.content)
        console.log('tag type:', activeTagType)
        blockType = getBlockType(node, blockTypeRegex)
        nodesForCurrentBlock = []
        continue
      }

      if (isActiveBlockEndTag(node, activeTagType)) {
        if (activeTagType === '') {
          throw new UnprintedUserError(
            `found end tag '${node.type}' without start tag`,
            node.filepath,
            node.line
          )
        }
        result.push({
          type: blockType,
          filename: node.filepath,
          line: node.line,
          nodes: nodesForCurrentBlock
        })
        activeTagType = ''
        blockType = ''
        nodesForCurrentBlock = []
        continue
      }

      if (activeTagType !== '') {
        nodesForCurrentBlock.push(node)
        continue
      }
    }
  }
  return result
}

// _isActiveBlockStartTag returns whether the given AstNode is the start of an active block
function isActiveBlockStartTag (node: AstNode, blockTypeRegex: RegExp): boolean {
  if (!node.content) return false
  return blockTypeRegex.test(node.content)
}

// _getBlockType returns the activity type started by the given AstNode that starts an active block
function getBlockType (node: AstNode, blockTypeRegex: RegExp): string {
  if (node.content == null) throw new Error("this shouldn't happen")
  const matches = node.content.match(blockTypeRegex)
  if (!matches) throw new Error("this shouldn't happen")
  return matches[1]
}

// Returns whether the given node is the end of an active block
function isActiveBlockEndTag (node: AstNode, activeTagType: string) {
  return node.content === `</${activeTagType}>`
}
