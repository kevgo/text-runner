import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { printUserError } from "./errors/print-user-error"
import {
  Configuration,
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

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = parseCmdlineArgs(process.argv)
    const configuration = await loadConfiguration(cmdLineConfig)
    const command = await instantiateCommand(commandName, configuration, debugSubcommand)
    const formatter = instantiateFormatter(
      configuration.formatterName || "detailed",
      configuration.sourceDir || ".",
      command
    )
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
  config: Configuration,
  debugSubcommand: DebugSubcommand | undefined
) {
  switch (commandName) {
    case "help":
      return new HelpCommand()
    case "scaffold":
      return new ScaffoldCommand(config)
    case "setup":
      return new SetupCommand(config)
    case "version":
      return new VersionCommand()
    case "debug":
      return new DebugCommand(config, debugSubcommand)
    case "dynamic":
      return new DynamicCommand(config)
    case "run":
      return new RunCommand(config)
    case "static":
      return new StaticCommand(config)
    case "unused":
      return new UnusedCommand(config)
    default:
      throw new UserError(`unknown command: ${commandName}`)
  }
}
