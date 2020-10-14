import * as assertNoDiff from "assert-no-diff"
import * as tr from "text-runner-core"
import * as helpers from "text-runner-core/src/helpers"

export default function allActionArgs(action: tr.actions.Args): void {
  const ignore = action.region[0].attributes.ignore
  const documented = action.region.textInNodesOfType("strong").sort().map(helpers.removeTrailingColon)
  const existing = Object.keys(action)
    .sort()
    .filter(tool => tool !== ignore)
  assertNoDiff.trimmedLines(documented.join("\n"), existing.join("\n"))
}
