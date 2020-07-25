import { AstNodeAttributes } from "../../standard-AST/ast-node"

/** converts the given HTML AST node attributes into the standard AST format */
export function standardizeHTMLAttributes(attrs: any): AstNodeAttributes {
  const result: AstNodeAttributes = {}
  if (attrs) {
    for (const attr of attrs) {
      result[attr.name] = attr.value
    }
  }
  return result
}
