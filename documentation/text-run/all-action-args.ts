import * as assertNoDiff from "assert-no-diff"
import * as tr from "text-runner"

export default function allActionArgs(action: tr.actions.Args): void {
  const ignore = action.region[0].attributes.ignore
  const documented = action.region.textInNodesOfType("strong").sort().map(tr.helpers.removeTrailingColon)
  const existing = Object.keys(action)
    .sort()
    .filter(tool => tool !== ignore)
  assertNoDiff.trimmedLines(documented.join("\n"), existing.join("\n"))
}
