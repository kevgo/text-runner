import { AstNode } from "text-runner-core"
import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner-core/src/helpers/remove-trailing-colon"
import { ActionArgs } from "text-runner-core"

export default async function verifyAstNodeAttributes(action: ActionArgs) {
  const expected = action.region.textInNodesOfType("strong").sort().map(removeTrailingColon).join("\n")
  const actual = Object.keys(AstNode.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
