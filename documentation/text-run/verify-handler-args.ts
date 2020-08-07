import * as assertNoDiff from "assert-no-diff"
import { removeTrailingColon } from "../../text-runner/src/helpers/remove-trailing-colon"
import removeValue from "remove-value"
import { ActionArgs } from "text-runner"

export default function verifyHandlerArgs(args: ActionArgs) {
  const expectedTools = args.nodes.textInNodesOfType("strong").sort().map(removeTrailingColon)
  const actualTools = Object.keys(args).sort()
  removeValue(actualTools, "linkTargets")
  assertNoDiff.trimmedLines(expectedTools.join("\n"), actualTools.join("\n"))
}
