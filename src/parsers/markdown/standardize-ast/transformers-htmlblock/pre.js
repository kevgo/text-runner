// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

module.exports = async function transformPre (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Promise<AstNodeList> {
  const result = new AstNodeList()
  const match = node.content.match(preRegex)
  const resultNode = new AstNode({
    type: 'fence',
    tag: 'pre',
    file,
    line,
    content: match[2],
    attributes: parseHtmlAttributes(match[1])
  })
  openTags.add(resultNode)
  result.pushData(resultNode)
  return result
}
