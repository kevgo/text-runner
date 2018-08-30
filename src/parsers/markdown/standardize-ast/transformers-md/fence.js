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
    type: 'paragraph_open',
    tag: 'p',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushNode({
    type: 'fence_open',
    tag: 'pre',
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
    type: 'fence_close',
    tag: '/pre',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushNode({
    type: 'paragraph_close',
    tag: '/p',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
