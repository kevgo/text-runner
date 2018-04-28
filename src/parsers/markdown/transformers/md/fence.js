// @flow

import type { AstNode } from '../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Array<AstNode> {
  return [
    {
      type: 'paragraph_open',
      tag: 'p',
      file: file,
      line,
      content: '',
      attributes: {}
    },
    {
      type: 'fence_open',
      tag: 'pre',
      file: file,
      line,
      content: '',
      attributes: {}
    },
    {
      type: 'text',
      tag: '',
      file: file,
      line,
      content: node.content,
      attributes: {}
    },
    {
      type: 'fence_close',
      tag: '/pre',
      file: file,
      line,
      content: '',
      attributes: {}
    },
    {
      type: 'paragraph_close',
      tag: '/p',
      file: file,
      line,
      content: '',
      attributes: {}
    }
  ]
}
