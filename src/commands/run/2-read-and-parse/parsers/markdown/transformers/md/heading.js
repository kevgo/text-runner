// @flow

import type { AstNode } from '../../ast-node.js'

module.exports = function (node, filepath: string, line: number): AstNode {
  return {
    type: `h${node.hLevel}`,
    filepath,
    line,
    content: node.text,
    attributes: {
      src: node.src
    }
  }
}
