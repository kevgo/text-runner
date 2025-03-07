import * as color from "colorette"
import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"

import { PackageJson } from "./package-json.js"
import * as helpers from "../helpers/trim-npm-run.js"

export async function scriptCall(action: textRunner.actions.Args): Promise<void> {
  const call = action.region.text().trim()
  if (call === "") {
    throw new Error("No script call specified")
  }
  if (call.startsWith("npm run ")) {
    throw new Error(`Does not start with 'npm run': ${call}`)
  }
  const want = helpers.trimNpmRun(call)
  action.name(`verifying call of npm package script ${color.cyan(want)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgText = await fs.readFile(packageJsonPath, "utf-8")
  const pkgData: PackageJson = JSON.parse(pkgText)
  if (!Object.keys(pkgData.scripts).includes(want)) {
    throw new Error(`package.json does not have a "${call}" script`)
  }
}
