import * as textRunner from "text-runner-core"

import * as config from "../configuration.js"
import { HelpCommand } from "./help.js"
import * as scaffold from "./scaffold.js"
import { SetupCommand } from "./setup.js"
import { VersionCommand } from "./version.js"

export function instantiate(
  commandName: string,
  userConfig: config.Data,
  debugSubcommand: textRunner.commands.DebugSubcommand | undefined
): textRunner.commands.Command {
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
      return new textRunner.commands.Debug(trConfig, debugSubcommand)
    case "dynamic":
      return new textRunner.commands.Dynamic(trConfig)
    case "run":
      return new textRunner.commands.Run(trConfig)
    case "static":
      return new textRunner.commands.Static(trConfig)
    case "unused":
      return new textRunner.commands.Unused(trConfig)
    default:
      throw new textRunner.UserError(
        `unknown command: ${commandName}`,
        `Run "text-runner help" for a list of all valid commands.`
      )
  }
}
