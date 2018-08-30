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
    type: 'code_open',
    tag: 'code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushNode({
    type: 'text',
    tag: '',
    file: file,
    line,
    content: node.content,
    attributes: {}
  })
  result.pushNode({
    type: 'code_close',
    tag: '/code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
