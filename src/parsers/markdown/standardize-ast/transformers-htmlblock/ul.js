// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const ulRegex = /<ul([^>]*)>([\s\S]*)<\/ul>/m

module.exports = function transformUl (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const match = node.content.match(ulRegex)
  const resultNode = new AstNode({
    type: 'bullet_list',
    tag: 'ul',
    file,
    line,
    content: match[2],
    attributes: parseHtmlAttributes(match[1])
  })
  openTags.add(resultNode)
  result.pushData(resultNode)
  return result
}
