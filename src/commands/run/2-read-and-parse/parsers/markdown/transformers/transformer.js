// @flow

import type { AstNode } from '../ast-node.js'

export interface Transformer {
  matches(node: Object): boolean;
  apply(node: Object, filepath: string, line: number): AstNode;
}
