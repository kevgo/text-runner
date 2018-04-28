// @flow

import type { AstNode } from '../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const parseHtmlAttributes = require('../../../../helpers/parse-html-attributes.js')
const preRegex = /<pre([^>]*)>([\s\S]*)<\/pre>/m

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Array<AstNode> {
  const match = node.content.match(preRegex)
  if (!match) return []
  return [
    {
      type: 'fence_open',
      tag: 'pre',
      file: file,
      line,
      content: '',
      attributes: parseHtmlAttributes(match[1])
    },
    {
      type: 'text',
      tag: '',
      file: file,
      line,
      content: match[2],
      attributes: {}
    },
    {
      type: 'fence_close',
      tag: '/pre',
      file: file,
      line,
      content: '',
      attributes: {}
    }
  ]
}
