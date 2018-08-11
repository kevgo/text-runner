// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openNode = openTags.popType('list_item_open', file.platformified(), line)
  result.pushNode({
    type: node.type,
    tag: '/li',
    file,
    line,
    content: '',
    attributes: openNode.attributes
  })
  return result
}
