import { CLIConfiguration } from "../configuration/cli-configuration"
import { HelpCommand } from "./help"
import * as scaffold from "./scaffold"
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
  userConfig: CLIConfiguration,
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
      return new scaffold.Command(userConfig.files, sourceDir, userConfig.scaffoldLanguage || "js")
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

/** returns a list of all available commands */
export function available(): string[] {
  return ["debug", "dynamic", "help", "run", "unused", "scaffold", "setup", "static", "version"]
}
