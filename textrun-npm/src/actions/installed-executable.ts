import * as color from "colorette"
import { promises as fsp } from "fs"
import * as path from "path"
import * as textRunner from "text-runner-core"

import { trimDollar } from "../helpers/trim-dollar.js"

export async function installedExecutable(action: textRunner.actions.Args): Promise<void> {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new textRunner.UserError(
      "Executable name not specified",
      "This action checks for executables provided by npm modules that you have installed. They are typically inside node_modules/.bin. Please provide the name of the executable.",
      action.location
    )
  }
  action.name(`installed npm executable ${color.cyan(commandName)}`)
  const fullPath = path.join("node_modules", ".bin", commandName)
  try {
    await fsp.stat(action.configuration.sourceDir.joinStr(fullPath))
  } catch (e) {
    if (textRunner.isFsError(e) && e.code === "ENOENT") {
      throw new Error(`no installed executable ${color.cyan(fullPath)} found`)
    } else {
      throw e
    }
  }
}
