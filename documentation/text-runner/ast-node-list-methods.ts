import * as assertNoDiff from "assert-no-diff"
import * as textRunner from "text-runner"

export default function astNodeListMethods(action: textRunner.actions.Args): void {
  const ignore = (action.region[0].attributes["ignore"] || "").split(",").filter(s => s)
  ignore.push("constructor")
  const documented = action.region
    .textInNodesOfType("strong")
    .map(textRunner.helpers.removeTrailingColon)
    .map(upToOpenParen)
    .sort()
  const existing = Object.getOwnPropertyNames(textRunner.ast.NodeList.prototype)
    .filter(s => !ignore.includes(s))
    .sort()
  assertNoDiff.json(documented, existing)
}

function upToOpenParen(text: string): string {
  return text.substring(0, text.indexOf("("))
}
