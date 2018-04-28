// @flow

import type { AstNode } from '../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Array<AstNode> {
  const openNode = openTags.pop('paragraph_open')
  return [
    {
      type: node.type,
      tag: '/p',
      file,
      line,
      content: '',
      attributes: openNode.attributes
    }
  ]
}
