// @flow

import type { AstNode } from '../../ast-node.js'

module.exports = function (node, filepath: string, line: number): AstNode {
  return {
    type: 'image',
    filepath,
    line,
    content: '', // TODO: add alt text here
    attributes: {
      src: node.src
    }
  }
}
