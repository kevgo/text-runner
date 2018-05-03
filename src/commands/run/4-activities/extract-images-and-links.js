// @flow

import type { ActivityList } from '../4-activities/activity-list.js'

const AstNodeList = require('../../../parsers/ast-node-list.js')

module.exports = function (tree: AstNodeList): ActivityList {
  const result: ActivityList = []
  for (let node of tree) {
    switch (node.type) {
      case 'link_open':
        result.push({
          type: 'check-link',
          file: node.file,
          line: node.line,
          nodes: tree.getNodesFor(node)
        })
        break

      case 'image':
        result.push({
          type: 'check-image',
          file: node.file,
          line: node.line,
          nodes: new AstNodeList([node])
        })
        break
    }
  }
  return result
}
