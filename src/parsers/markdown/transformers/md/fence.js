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
    type: 'paragraph_open',
    tag: 'p',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushData({
    type: 'fence_open',
    tag: 'pre',
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
    type: 'fence_close',
    tag: '/pre',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  result.pushData({
    type: 'paragraph_close',
    tag: '/p',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
