import * as assertNoDiff from "assert-no-diff"
import * as tr from "text-runner"

export default function astNodeAttributes(action: tr.actions.Args): void {
  const documented = action.region.textInNodesOfType("strong").sort().map(tr.helpers.removeTrailingColon).join("\n")
  const existing = Object.keys(tr.ast.Node.scaffold()).sort().join("\n")
  assertNoDiff.chars(documented, existing)
}
