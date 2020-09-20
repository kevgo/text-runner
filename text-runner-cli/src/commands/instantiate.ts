import * as config from "../configuration"
import * as scaffold from "./scaffold"
import { HelpCommand } from "./help"
import { SetupCommand } from "./setup"
import { VersionCommand } from "./version"
import {
  DebugCommand,
  DebugSubcommand,
  DynamicCommand,
  RunCommand,
  StaticCommand,
  UnusedCommand,
  UserError,
} from "text-runner-core"

export async function instantiate(
  commandName: string,
  userConfig: config.Data,
  debugSubcommand: DebugSubcommand | undefined
) {
  const sourceDir = userConfig.sourceDir || "."
  switch (commandName) {
    case "help":
      return new HelpCommand()
    case "scaffold":
      if (!userConfig.files) {
        throw new Error("no action name given")
      }
      return new scaffold.ScaffoldCommand(userConfig.files, sourceDir, userConfig.scaffoldLanguage || "js")
    case "setup":
      return new SetupCommand(userConfig)
    case "version":
      return new VersionCommand()
  }
  const trConfig = userConfig.toCoreConfig()
  switch (commandName) {
    case "debug":
      return new DebugCommand(trConfig, debugSubcommand)
    case "dynamic":
      return new DynamicCommand(trConfig)
    case "run":
      return new RunCommand(trConfig)
    case "static":
      return new StaticCommand(trConfig)
    case "unused":
      return new UnusedCommand(trConfig)
    default:
      throw new UserError(`unknown command: ${commandName}`)
  }
}
