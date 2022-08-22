import * as assertNoDiff from "assert-no-diff"
import * as textRunner from "text-runner"

export default function allActionArgs(action: textRunner.actions.Args): void {
  const ignore = action.region[0].attributes.ignore
  const documented = action.region.textInNodesOfType("strong").sort().map(textRunner.helpers.removeTrailingColon)
  const existing = Object.keys(action)
    .sort()
    .filter(tool => tool !== ignore)
  assertNoDiff.trimmedLines(documented.join("\n"), existing.join("\n"))
}
