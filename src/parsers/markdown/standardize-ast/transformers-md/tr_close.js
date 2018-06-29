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
    type: node.type,
    tag: '/tr',
    file,
    line,
    content: '',
    attributes: {}
  })
  openTags.popType('tr_open', file, line)
  return result
}
