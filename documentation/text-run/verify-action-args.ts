import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner-core/src/helpers/remove-trailing-colon"
import { ActionArgs } from "text-runner-core"

export default function verifyActionArgs(action: ActionArgs) {
  const ignore = action.region[0].attributes.ignore
  const expectedTools = action.region.textInNodesOfType("strong").sort().map(removeTrailingColon)
  const actualTools = Object.keys(action)
    .sort()
    .filter((tool) => tool !== ignore)
  assertNoDiff.trimmedLines(expectedTools.join("\n"), actualTools.join("\n"))
}
