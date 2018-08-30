// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

module.exports = async function transformBlockquote (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  const resultNode = new AstNode({
    type: 'blockquote',
    tag: 'blockquote',
    file,
    line,
    content: blockquoteMatch[2],
    attributes: parseHtmlAttributes(blockquoteMatch[1])
  })
  result.pushNode(resultNode)
  return result
}
