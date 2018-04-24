// @flow

import type { AstNode } from '../../ast-node.js'

type TagData = {
  node: AstNode,
  line: number,
  text: string // textual content of the tag
}

module.exports = class TagContentCollector {
  tags: { [string]: TagData }

  constructor () {
    this.tags = {}
  }
}
