// @flow

import type { AstNode } from '../../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): ?AstNode {
  const openingTag = openTags.popOpenTagFor('heading_open')
  return {
    type: `h${openingTag.node.hLevel}`,
    filepath,
    line,
    content: openingTag.text,
    attributes: {}
  }
}
