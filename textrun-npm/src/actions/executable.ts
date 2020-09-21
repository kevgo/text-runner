import * as color from "colorette"
import * as path from "path"
import { trimDollar } from "../helpers/trim-dollar"
import * as tr from "text-runner-core"

export function executable(action: tr.ActionArgs): void {
  const commandName = trimDollar(action.region.text().trim())
  if (commandName === "") {
    throw new Error("No npm package installation command found")
  }
  action.name(`NPM package exports executable ${color.cyan(commandName)}`)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkgData = require(path.join(action.configuration.sourceDir, "package.json"))
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
