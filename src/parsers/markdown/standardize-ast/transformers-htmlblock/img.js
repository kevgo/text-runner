// @flow

const AstNode = require('../../../ast-node.js')
const AbsoluteFilePath = require('../../../../domain-model/absolute-file-path.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const removeHtmlComments = require('../../helpers/remove-html-comments.js')

const olRegex = /<img([^>]*)>/

module.exports = async function transformOl (
  node: Object,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = removeHtmlComments(node.content).match(olRegex)
  if (!match) throw new Error('cannot parse tag')
  const hrNode = new AstNode({
    type: 'image',
    tag: 'img',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushNode(hrNode)
  return result
}
