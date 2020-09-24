import * as assertNoDiff from "assert-no-diff"
import * as helpers from "../../text-runner-core/src/helpers"
import * as tr from "text-runner-core"

export default function verifyActionArgs(action: tr.ActionArgs): void {
  const ignore = action.region[0].attributes.ignore
  const expectedTools = action.region.textInNodesOfType("strong").sort().map(helpers.removeTrailingColon)
  const actualTools = Object.keys(action)
    .sort()
    .filter(tool => tool !== ignore)
  assertNoDiff.trimmedLines(expectedTools.join("\n"), actualTools.join("\n"))
}
