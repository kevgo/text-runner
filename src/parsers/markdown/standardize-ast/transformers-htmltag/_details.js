// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function transformDetailsTag (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType(
    'details_open',
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    type: 'details_close',
    tag: '/details',
    file,
    line,
    content: '',
    attributes: openingTag.attributes
  })
  result.pushNode(resultNode)
  return result
}
