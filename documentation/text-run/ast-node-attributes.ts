import * as assertNoDiff from "assert-no-diff"
import * as tr from "text-runner"
import * as helpers from "text-runner-core/src/helpers"

export default function astNodeAttributes(action: tr.actions.Args): void {
  const documented = action.region.textInNodesOfType("strong").sort().map(helpers.removeTrailingColon).join("\n")
  const existing = Object.keys(tr.ast.Node.scaffold()).sort().join("\n")
  assertNoDiff.chars(documented, existing)
}
