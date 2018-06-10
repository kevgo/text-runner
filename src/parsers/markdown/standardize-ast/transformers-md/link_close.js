// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  // TODO: remove openTags, since MD nodes never have attributes
  const openNode = openTags.popType('link_open')
  const result = new AstNodeList()
  result.pushData({
    type: node.type,
    tag: '/a',
    file,
    line,
    content: '',
    attributes: openNode.attributes
  })
  return result
}
