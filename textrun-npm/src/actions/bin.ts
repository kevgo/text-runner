import color from "colorette"
import path from "path"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "text-runner/src/actions/types/action-args"

export function bin(action: ActionArgs) {
  action.name("NPM package exports a command")
  const commandName = trimDollar(action.nodes.text().trim())
  const pkgData = require(path.join(action.configuration.sourceDir, "package.json"))
  action.name(`NPM module exports the ${color.cyan(commandName)} command`)
  if (!Object.keys(pkgData.bin).includes(commandName)) {
    throw new Error(`${color.cyan("package.json")} does not export a ${color.red(commandName)} command`)
  }
}
