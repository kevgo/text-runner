import { AstNodeAttributes } from "../../standard-AST/ast-node"
import * as parse5 from "parse5"

/** converts the given HTML AST node attributes into the standard AST format */
export function standardizeHTMLAttributes(attrs: parse5.Attribute[]): AstNodeAttributes {
  const result: AstNodeAttributes = {}
  if (attrs) {
    for (const attr of attrs) {
      result[attr.name] = attr.value
    }
  }
  return result
}
