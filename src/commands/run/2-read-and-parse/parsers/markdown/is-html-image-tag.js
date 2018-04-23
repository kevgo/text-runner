// @flow

import type { AstNode } from '../../ast-node.js'

const regex = /<img [^>]*src=".*?".*?>/

// Returns whether this AST node represents an HTML tag
module.exports = function isHtmlImageTag (node: AstNode): boolean {
  return node.type === 'htmltag' && regex.test(node.content)
}
