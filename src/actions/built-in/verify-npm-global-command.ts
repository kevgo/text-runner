import color from "colorette"
import path from "path"
import { trimDollar } from "../helpers/trim-dollar"
import { ActionArgs } from "../types/action-args"

export default function verifyNpmGlobalCommand(args: ActionArgs) {
  args.name("NPM module exports the command")
  const commandName = trimDollar(
    args.nodes.textInNodeOfType("fence", "code").trim()
  )
  const pkg = require(path.join(args.configuration.sourceDir, "package.json"))
  args.name(`NPM module exports the ${color.cyan(commandName)} command`)

  if (!hasCommandName(commandName, pkg.bin)) {
    throw new Error(
      `${color.cyan("package.json")} does not export a ${color.red(
        commandName
      )} command`
    )
  }
}

function hasCommandName(
  commandName: string,
  exportedCommands: { [key: string]: string }
): boolean {
  return Object.keys(exportedCommands).includes(commandName)
}
