import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import { startsWithNpmRun } from "../helpers/starts-with-npm-run.js"
import { trimNpmRun } from "../helpers/trim-npm-run.js"
import { PackageJson } from "./package-json.js"

export async function scriptCall(action: textRunner.actions.Args): Promise<void> {
  const call = action.region.text().trim()
  if (call === "") {
    throw new Error("No script call specified")
  }
  if (!startsWithNpmRun(call)) {
    throw new Error(`Does not start with "npm run": ${call}`)
  }
  const want = trimNpmRun(call)
  action.name(`verify call of npm package script ${styleText("cyan", want)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgText = await fs.readFile(packageJsonPath, "utf-8")
  const pkgData: PackageJson = JSON.parse(pkgText)
  if (!Object.keys(pkgData.scripts).includes(want)) {
    throw new Error(`package.json does not contain a "${want}" script`)
  }
}
