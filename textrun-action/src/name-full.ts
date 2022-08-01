import { promises as fs } from "fs"
import * as tr from "text-runner-core"

import { IndexFile, PackageJson } from "./files"

export async function nameFull(action: tr.actions.Args): Promise<void> {
  const want = action.region.text()
  action.name(`verify full name of action "${want}"`)
  const wantStd = tr.actions.name(want)
  const pkgJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgJson: PackageJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))
  const mainPath = action.configuration.sourceDir.joinStr(pkgJson.main)
  const main: IndexFile = await import(mainPath)
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
