import * as color from "colorette"
import * as fs from "fs-extra"
import * as tr from "text-runner-core"

import { trimDollar } from "../helpers/trim-dollar.js"
import { PackageJson } from "./package-json.js"

export async function exportedExecutable(action: tr.actions.Args): Promise<void> {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new Error("No executable name specified")
  }
  action.name(`npm package exports executable ${color.cyan(commandName)}`)
  const packageJsonPath = action.configuration.sourceDir.joinStr("package.json")
  const pkgData: PackageJson = await fs.readJSON(packageJsonPath)
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
