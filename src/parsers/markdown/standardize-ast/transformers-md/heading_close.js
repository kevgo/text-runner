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
  const openNode = openTags.popType('heading_open', file.platformified(), line)
  const result = new AstNodeList()
  result.pushNode({
    type: node.type,
    tag: `/${openNode.tag}`,
    file,
    line,
    content: '',
    attributes: openNode.attributes
  })
  return result
}
