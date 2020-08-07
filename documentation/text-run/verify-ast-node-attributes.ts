import { AstNode } from "../../text-runner/src/parsers/standard-AST/ast-node"
import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner/src/helpers/remove-trailing-colon"
import { ActionArgs } from "text-runner"

export default async function verifyAstNodeAttributes(args: ActionArgs) {
  const expected = args.nodes.textInNodesOfType("strong").sort().map(removeTrailingColon).join("\n")
  const actual = Object.keys(AstNode.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
