import * as tr from "text-runner-core"
import * as path from "path"

export function nameShort(action: tr.ActionArgs) {
  const want = action.region.text()
  const wantStd = tr.actionName(want)
  const pkgJson = require(path.join(action.configuration.sourceDir, "package.json"))
  const main = require(path.join(action.configuration.sourceDir, pkgJson.main))
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actionName)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
