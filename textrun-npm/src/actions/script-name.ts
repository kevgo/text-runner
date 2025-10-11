import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import { PackageJson } from "./package-json.js"

export async function scriptName(action: textRunner.actions.Args): Promise<void> {
  const want = action.region.text().trim()
  if (want === "") {
    throw new Error("No script name specified")
  }
  action.name(`npm package has script ${styleText("cyan", want)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgText = await fs.readFile(packageJsonPath, "utf-8")
  const pkgData: PackageJson = JSON.parse(pkgText)
  if (!Object.keys(pkgData.scripts).includes(want)) {
    throw new Error(`package.json does not have a "${want}" script`)
  }
}
