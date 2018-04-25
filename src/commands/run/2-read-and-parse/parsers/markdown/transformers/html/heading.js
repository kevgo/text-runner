// @flow

import type { AstNode } from '../../../../ast-node.js'
import type { Transformer } from '../transformer.js'

const parseAttributes = require('../../helpers/parse-attributes.js')

const obj: Transformer = {
  matches: function (node): boolean {
    return node.type === 'heading_open'
  },

  apply: function (node, filepath: string, line: number): AstNode {
    return {
      type: node.type,
      filepath,
      line,
      content: node.text,
      attributes: parseAttributes(node.content, filepath, line)
    }
  }
}

module.exports = obj
