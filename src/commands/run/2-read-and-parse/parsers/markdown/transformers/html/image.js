// @flow

import type { AstNode } from '../ast-node.js'

const parseAttributes = require('../helpers/parse-attributes.js')

// returns the TR-AST for the given R-AST markdown image tag
module.exports = function transformMarkdownImage (
  node: AstNode,
  filepath: string,
  line: number
): AstNode {
  return {
    type: 'image',
    filepath,
    line,
    content: '', // TODO: add alt text here
    attributes: parseAttributes(node.content, filepath, line),
    html: node.content
  }
}
