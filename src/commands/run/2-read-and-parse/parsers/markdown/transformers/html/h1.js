// @flow

import type { AstNode } from '../../../../ast-node.js'

const OpenTagTracker = require('../../helpers/open-tag-tracker.js')
const parseAttributes = require('../../helpers/parse-attributes.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  filepath: string,
  line: number
): ?AstNode {
  const tagData = openTags.pop('h1')
  return {
    type: 'h1',
    tag: 'h1',
    filepath,
    line,
    content: tagData.text,
    attributes: parseAttributes(tagData.node.content, filepath, line)
  }
}
