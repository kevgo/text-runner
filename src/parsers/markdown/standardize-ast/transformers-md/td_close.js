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
  result.pushNode({
    type: node.type,
    tag: '/td',
    file,
    line,
    content: '',
    attributes: {}
  })
  openTags.popType('td_open', file.platformified(), line)
  return result
}
