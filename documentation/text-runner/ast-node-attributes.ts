import * as assertNoDiff from "assert-no-diff"
import * as textRunner from "text-runner"

export default function astNodeAttributes(action: textRunner.actions.Args): void {
  const documented = action.region
    .textInNodesOfType("strong")
    .sort()
    .map(textRunner.helpers.removeTrailingColon)
    .join("\n")
  const existing = Object.keys(textRunner.ast.Node.scaffold()).sort().join("\n")
  assertNoDiff.chars(documented, existing)
}
