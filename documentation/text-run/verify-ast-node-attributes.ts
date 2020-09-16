import * as tr from "text-runner-core"
import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner-core/src/helpers/remove-trailing-colon"

export default async function verifyAstNodeAttributes(action: tr.ActionArgs) {
  const expected = action.region.textInNodesOfType("strong").sort().map(removeTrailingColon).join("\n")
  const actual = Object.keys(tr.AstNode.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
