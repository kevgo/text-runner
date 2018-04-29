// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  result.pushData({
    type: 'code_open',
    tag: 'code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushData({
    type: 'text',
    tag: '',
    file: file,
    line,
    content: node.content,
    attributes: {}
  })
  result.pushData({
    type: 'code_close',
    tag: '/code',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
