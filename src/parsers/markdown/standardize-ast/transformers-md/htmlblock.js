// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const UnprintedUserError = require('../../../../errors/unprinted-user-error.js')

const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m
const tableRegex = /<table([^>]*)>[\s\S]*<\/table>/

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const preMatch = node.content.match(preRegex)
  if (preMatch) {
    result.pushData({
      type: 'fence_open',
      tag: 'pre',
      file: file,
      line,
      content: '',
      attributes: parseHtmlAttributes(preMatch[1])
    })
    result.pushData({
      type: 'text',
      tag: '',
      file: file,
      line,
      content: preMatch[2],
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
  const tableMatch = node.content.trim().match(tableRegex)
  if (tableMatch) {
    result.pushData({
      type: 'table',
      tag: 'table',
      file: file,
      line,
      content: node.content.trim(),
      attributes: parseHtmlAttributes(tableMatch[1])
    })
    return result
  }
  throw new UnprintedUserError(
    `Unknown 'htmlblock' encountered: ${node.content}`,
    file,
    line
  )
}
