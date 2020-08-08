import color from "colorette"
import path from "path"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "text-runner/src/actions/types/action-args"

export function executable(action: ActionArgs) {
  const commandName = trimDollar(action.nodes.text().trim())
  if (commandName === "") {
    throw new Error("No npm package installation command found")
  }
  action.name(`NPM package exports executable ${color.cyan(commandName)}`)
  const pkgData = require(path.join(action.configuration.sourceDir, "package.json"))
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`package.json does not export a "${commandName}" command`)
  }
}
