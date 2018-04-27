// @flow

import type { AstNode } from '../../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): ?AstNode {
  const openNode = openTags.pop('heading_open')
  return {
    type: node.type,
    tag: `/${openNode.tag}`,
    file,
    line,
    content: '',
    attributes: openNode.attributes
  }
}
