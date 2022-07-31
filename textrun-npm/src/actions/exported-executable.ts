import * as color from "colorette"
import { promises as fs } from "fs"
import * as tr from "text-runner-core"

import { trimDollar } from "../helpers/trim-dollar"
import { PackageJson } from "./package-json"

export async function exportedExecutable(action: tr.actions.Args): Promise<void> {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new Error("No executable name specified")
  }
  action.name(`npm package exports executable ${color.cyan(commandName)}`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgJsonText = await fs.readFile(action.configuration.sourceDir.joinStr("package.json"), "utf8")
  const pkgData: PackageJson = JSON.parse(pkgJsonText)
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
