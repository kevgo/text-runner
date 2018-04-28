// @flow

import type { AstNode } from '../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): Array<AstNode> {
  const result: AstNode = {
    type: node.type,
    tag: '/em',
    file,
    line,
    content: '',
    attributes: {}
  }
  openTags.pop('em_open')
  return [result]
}
