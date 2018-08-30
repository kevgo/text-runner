// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function transformSummaryTag (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType(
    'summary_open',
    file.platformified(),
    line
  )
  const resultNode = new AstNode({
    type: 'summary_close',
    tag: '/summary',
    file,
    line,
    content: '',
    attributes: openingTag.attributes
  })
  result.pushNode(resultNode)
  return result
}
