import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"

export async function nameFull(action: textRunner.actions.Args): Promise<void> {
  const want = action.region.text()
  action.name(`verify full name of action "${want}"`)
  const wantStd = textRunner.actions.name(want)
  const pkgJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgJson: textRunner.exports.PackageJson = JSON.parse(await fs.readFile(pkgJsonPath, "utf-8"))
  const exportsPath = action.configuration.sourceDir.joinStr(pkgJson.exports)
  const main: textRunner.exports.IndexFile = await import(exportsPath)
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(textRunner.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
