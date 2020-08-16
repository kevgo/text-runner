import { AstNode } from "text-runner"
import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner/src/helpers/remove-trailing-colon"
import { ActionArgs } from "text-runner"

export default async function verifyAstNodeAttributes(action: ActionArgs) {
  const expected = action.nodes.textInNodesOfType("strong").sort().map(removeTrailingColon).join("\n")
  const actual = Object.keys(AstNode.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
