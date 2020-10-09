import * as tr from "text-runner-core"

export function nameShort(action: tr.actions.Args): void {
  const want = action.region.text()
  const wantStd = tr.actions.name(want)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgJson = require(action.configuration.sourceDir.joinStr("package.json"))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const main = require(action.configuration.sourceDir.joinStr(pkgJson.main))
  const allNames = Object.keys(main.textrunActions)
  const allNamesStd = allNames.map(tr.actions.name)
  if (!allNamesStd.includes(wantStd)) {
    throw new Error(`This module does not export action "${want}. Found [${allNames.join(", ")}] `)
  }
}
