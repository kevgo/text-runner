// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const parseHtmlTag = require('../../helpers/parse-html-tag.js')

module.exports = function transformATag (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const [tag, attributes] = parseHtmlTag(node.content, file, line)
  const resultNode = new AstNode({
    type: 'em_open',
    tag,
    file,
    line,
    content: '',
    attributes
  })
  openTags.add(resultNode)
  result.pushData(resultNode)
  return result
}
