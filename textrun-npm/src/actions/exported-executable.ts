import * as color from "colorette"
import * as tr from "text-runner-core"

import { trimDollar } from "../helpers/trim-dollar"

export function exportedExecutable(action: tr.actions.Args): void {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new Error("No executable name specified")
  }
  action.name(`npm package exports executable ${color.cyan(commandName)}`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgData = require(action.configuration.sourceDir.joinStr("package.json"))
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
