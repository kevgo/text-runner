import * as tr from "text-runner-core"

import * as config from "../configuration"
import { HelpCommand } from "./help"
import * as scaffold from "./scaffold"
import { SetupCommand } from "./setup"
import { VersionCommand } from "./version"

export function instantiate(
  commandName: string,
  userConfig: config.Data,
  debugSubcommand: tr.commands.DebugSubcommand | undefined
): tr.commands.Command {
  switch (commandName) {
    case "help":
      return new HelpCommand()
    case "scaffold":
      if (!userConfig.files) {
        throw new Error("no action name given")
      }
      return new scaffold.ScaffoldCommand(userConfig.files, ".", userConfig.scaffoldLanguage || "js")
    case "setup":
      return new SetupCommand(userConfig)
    case "version":
      return new VersionCommand()
  }
  const trConfig = userConfig.toCoreConfig()
  switch (commandName) {
    case "debug":
      return new tr.commands.Debug(trConfig, debugSubcommand)
    case "dynamic":
      return new tr.commands.Dynamic(trConfig)
    case "run":
      return new tr.commands.Run(trConfig)
    case "static":
      return new tr.commands.Static(trConfig)
    case "unused":
      return new tr.commands.Unused(trConfig)
    default:
      throw new tr.UserError(`unknown command: ${commandName}`)
  }
}
