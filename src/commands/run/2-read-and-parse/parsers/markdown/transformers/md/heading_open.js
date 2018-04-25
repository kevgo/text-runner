// @flow

import type { AstNode } from '../../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): ?AstNode {
  openTags.add(node, filepath, line)
}
