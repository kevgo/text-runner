// @flow

import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'
import type { LinkTargetList } from './link-target-list.js'

const LinkTargetListBuilder = require('./link-target-list-builder.js')

module.exports = function (ASTs: AstNodeList[]): LinkTargetList {
  const builder = new LinkTargetListBuilder()
  for (let ast of ASTs) {
    builder.addLinkTargets(ast)
  }
  return builder.linkTargets
}
