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
    tag: '/td',
    file,
    line,
    content: '',
    attributes: {}
  })
  openTags.popType('td_open', file, line)
  return result
}
