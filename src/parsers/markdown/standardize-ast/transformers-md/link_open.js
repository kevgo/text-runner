// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const resultNode = new AstNode({
    type: node.type,
    tag: 'a',
    file,
    line,
    content: '',
    attributes: {
      href: node.href,
      title: node.title
    }
  })
  openTags.add(resultNode)
  result.push(resultNode)
  return result
}
