import * as tr from "text-runner-core"
import * as assertNoDiff from "assert-no-diff"
import * as helpers from "../../text-runner-core/src/helpers"

export default async function verifyAstNodeAttributes(action: tr.ActionArgs): Promise<void> {
  const expected = action.region.textInNodesOfType("strong").sort().map(helpers.removeTrailingColon).join("\n")
  const actual = Object.keys(tr.ast.Node.scaffold()).sort().join("\n")
  assertNoDiff.chars(expected, actual)
}
