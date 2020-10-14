import * as assertNoDiff from "assert-no-diff"
import * as tr from "text-runner-core"
import * as helpers from "text-runner-core/src/helpers"

export default function astNodeListMethods(action: tr.actions.Args): void {
  const ignore = (action.region[0].attributes["ignore"] || "").split(",").filter(s => s)
  ignore.push("constructor")
  const documented = action.region
    .textInNodesOfType("strong")
    .map(helpers.removeTrailingColon)
    .map(upToOpenParen)
    .sort()
  const existing = Object.getOwnPropertyNames(tr.ast.NodeList.prototype)
    .filter(s => !ignore.includes(s))
    .sort()
  assertNoDiff.json(documented, existing)
}

function upToOpenParen(text: string): string {
  return text.substring(0, text.indexOf("("))
}
