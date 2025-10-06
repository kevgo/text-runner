import { promises as fs } from "fs"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import { trimDollar } from "../helpers/trim-dollar.js"
import { PackageJson } from "./package-json.js"

export async function exportedExecutable(action: textRunner.actions.Args): Promise<void> {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new Error("No executable name specified")
  }
  action.name(`npm package exports executable ${styleText("cyan", commandName)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgText = await fs.readFile(packageJsonPath, "utf-8")
  const pkgData: PackageJson = JSON.parse(pkgText)
  if (!pkgData.bin) {
    throw new Error(`package.json does not export commands`)
  }
  if (!Object.keys(pkgData?.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
