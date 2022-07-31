import { promises as fs } from "fs"
import * as tr from "text-runner-core"

import { IndexFile, PackageJson } from "./files"

export async function nameFull(action: tr.actions.Args): Promise<void> {
  const want = action.region.text()
  action.name(`verify full name of action "${want}"`)
  const wantStd = tr.actions.name(want)
  const pkgJsonText = await fs.readFile(action.configuration.sourceDir.joinStr("package.json"), "utf8")
  const pkgJson: PackageJson = JSON.parse(pkgJsonText)
  const main: IndexFile = await import(action.configuration.sourceDir.joinStr(pkgJson.main))
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
