import { promises as fs } from "fs"
import * as tr from "text-runner-core"

export async function nameShort(action: tr.actions.Args): Promise<void> {
  const want = action.region.text()
  action.name(`verify short name of action "${want}"`)
  const wantStd = tr.actions.name(want)
  const pkgJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgJson: tr.exports.PackageJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))
  const exportsPath = action.configuration.sourceDir.joinStr(pkgJson.exports)
  const main: tr.exports.IndexFile = await import(exportsPath)
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
