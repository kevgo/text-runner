// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  var attributes = {}
  if (node.content) {
    const match = node.content.match(blockquoteRegex)
    if (!match) {
      throw new Error(`cannot parse blockquote content: ${node.content}`)
    }
    attributes = parseHtmlAttributes(match[1])
  }
  const resultNode = new AstNode({
    type: node.type,
    tag: 'blockquote',
    file,
    line,
    content: '',
    attributes
  })
  openTags.add(resultNode)
  result.pushNode(resultNode)
  return result
}
