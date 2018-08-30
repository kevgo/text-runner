// @flow

const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const olRegex = /<hr([^>]*)>/

module.exports = async function transformOl (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(olRegex)
  const hrNode = new AstNode({
    type: 'horizontal_row',
    tag: 'hr',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(hrNode)
  return result
}
