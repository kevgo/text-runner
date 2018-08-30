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
  // TODO: remove openTags, since MD nodes never have attributes
  const openNode = openTags.popType('link_open', file.platformified(), line)
  const result = new AstNodeList()
  result.pushNode({
    type: node.type,
    tag: '/a',
    file,
    line,
    content: '',
    attributes: openNode.attributes
  })
  return result
}
