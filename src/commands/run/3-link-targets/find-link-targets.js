// @flow

import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'
import type { LinkTargetList } from './link-target-list.js'

module.exports = function (ASTs: AstNodeList[]): LinkTargetList {
  ASTs.map(ast => targetsInFile(ast))
  return {}
}

function targetsInFile (ast: AstNodeList): LinkTargetList {
  return {}
}
