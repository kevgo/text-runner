// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const parseHtmlAttributes = require('../../../../helpers/parse-html-attributes.js')
const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const match = node.content.match(preRegex)
  const result = new AstNodeList()
  if (!match) return result
  result.pushData({
    type: 'fence_open',
    tag: 'pre',
    file: file,
    line,
    content: '',
    attributes: parseHtmlAttributes(match[1])
  })
  result.pushData({
    type: 'text',
    tag: '',
    file: file,
    line,
    content: match[2],
    attributes: {}
  })
  result.pushData({
    type: 'fence_close',
    tag: '/pre',
    file: file,
    line,
    content: '',
    attributes: {}
  })
  return result
}
