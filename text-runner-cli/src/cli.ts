import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { printUserError } from "./errors/print-user-error"
import {
  DebugCommand,
  DebugSubcommand,
  DynamicCommand,
  RunCommand,
  StaticCommand,
  UnusedCommand,
  UserError,
} from "text-runner-core"
import { HelpCommand } from "./commands/help"
import { ScaffoldCommand } from "./commands/scaffold"
import { SetupCommand } from "./commands/setup"
import { VersionCommand } from "./commands/version"
import { StatsCollector } from "./helpers/stats-collector"
import { loadConfiguration } from "./config/load-configuration"
import { instantiateFormatter } from "./formatters/instantiate"
import { parseCmdlineArgs } from "./cmdLineArgs/parse-cmdline-args"
import { UserProvidedConfiguration } from "./config/user-provided-configuration"
import { convertToConfig } from "./config/convert-to-config"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = parseCmdlineArgs(process.argv)
    const fileConfig = await loadConfiguration(cmdLineConfig)
    const userConfig = fileConfig.merge(cmdLineConfig).data()
    const command = await instantiateCommand(commandName, userConfig, debugSubcommand)
    const formatter = instantiateFormatter(userConfig.formatterName || "detailed", userConfig.sourceDir || ".", command)
    const statsCollector = new StatsCollector(command)
    await command.execute()
    const stats = statsCollector.stats()
    if (["dynamic", "run", "static"].includes(commandName)) {
      formatter.finish({ stats })
    }
    errorCount = stats.errorCount
  } catch (err) {
    errorCount += 1
    if (err instanceof UserError) {
      printUserError(err)
    } else {
      console.log(err.stack)
    }
  } finally {
    await endChildProcesses()
  }
  process.exit(errorCount)
}
main()

async function instantiateCommand(
  commandName: string,
  userConfig: UserProvidedConfiguration,
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
      return new ScaffoldCommand(userConfig.files, sourceDir, userConfig.scaffoldLanguage || "js")
    case "setup":
      return new SetupCommand(sourceDir)
    case "version":
      return new VersionCommand()
  }
  const trConfig = convertToConfig(userConfig)
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
