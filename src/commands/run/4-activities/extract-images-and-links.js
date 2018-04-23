// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
import type { AstNode } from '../2-read-and-parse/ast-node.js'
import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'

module.exports = function (tree: AstNodeList): ActivityList {
  const result: ActivityList = []
  for (let node: AstNode of tree) {
    if (isMarkdownLink(node)) {
      result.push({
        type: 'check-link',
        filename: node.filepath,
        line: node.line,
        nodes: [node]
      })
      continue
    }

    const target = htmlLinkTarget(node)
    if (target) {
      result.push({
        type: 'check-link',
        filename: node.filepath,
        line: node.line,
        nodes: [
          {
            filepath: node.filepath,
            line: node.line,
            type: node.type,
            html: node.html,
            content: target,
            attributes: node.attributes
          }
        ]
      })
    }

    if (node.type === 'image') {
      result.push({
        type: 'check-image',
        filename: node.filepath,
        line: node.line,
        nodes: [node]
      })
      continue
    }
  }
  return result
}

function htmlLinkTarget (node: AstNode): ?string {
  if (node.content == null) return null
  if (node.type !== 'htmltag') return null
  const matches = node.content.match(/<a[^>]*href="([^"]*)".*?>/)
  return matches ? matches[1] : null
}

// Returns whether the given node is a normal hyperlink
function isMarkdownLink (node) {
  return node.type === 'link_open'
}
