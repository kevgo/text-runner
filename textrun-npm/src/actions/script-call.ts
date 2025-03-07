import * as color from "colorette"
import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"

import { PackageJson } from "./package-json.js"
import { trimNpmRun } from "../helpers/trim-npm-run.js"
import { startsWithNpmRun } from "../helpers/starts-with-npm-run.js"

export async function scriptCall(action: textRunner.actions.Args): Promise<void> {
  const call = action.region.text().trim()
  if (call === "") {
    throw new Error("No script call specified")
  }
  if (!startsWithNpmRun(call)) {
    throw new Error(`Does not start with "npm run": ${call}`)
  }
  const want = trimNpmRun(call)
  action.name(`verify call of npm package script ${color.cyan(want)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgText = await fs.readFile(packageJsonPath, "utf-8")
  const pkgData: PackageJson = JSON.parse(pkgText)
  if (!Object.keys(pkgData.scripts).includes(want)) {
    throw new Error(`package.json does not contain a "${want}" script`)
  }
}
