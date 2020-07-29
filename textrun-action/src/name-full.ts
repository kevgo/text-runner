import { actionName, ActionArgs } from "text-runner"
import path from "path"

export function nameFull(args: ActionArgs) {
  const want = args.nodes.text()
  const wantStd = actionName(want)
  const pkgJson = require(path.join(args.configuration.sourceDir, "package.json"))
  const allNames = Object.keys(pkgJson.textrunActions)
  const allNamesStd = allNames.map(actionName)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
