import { promises as fs } from "fs"
import * as tr from "text-runner-core"

export async function nameShort(action: tr.actions.Args): Promise<void> {
  const want = action.region.text()
  const wantStd = tr.actions.name(want)
  const pkgJson = JSON.parse(await fs.readFile(action.configuration.sourceDir.joinStr("package.json"), "utf-8"))
  const main = await import(action.configuration.sourceDir.joinStr(pkgJson.main))
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
