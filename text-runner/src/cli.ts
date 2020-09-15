import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { UserError } from "./errors/user-error"
import { printUserError } from "./errors/print-user-error"
import { DebugCommand, DebugSubcommand } from "./commands/debug"
import { DynamicCommand } from "./commands/dynamic"
import { HelpCommand } from "./commands/help"
import { RunCommand } from "./commands/run"
import { ScaffoldCommand } from "./commands/scaffold"
import { SetupCommand } from "./commands/setup"
import { StaticCommand } from "./commands/static"
import { UnusedCommand } from "./commands/unused"
import { VersionCommand } from "./commands/version"
import { instantiateFormatter } from "./formatters/instantiate"
import { UserProvidedConfiguration } from "./configuration/user-provided-configuration"
import { Configuration } from "./configuration/configuration"
import { loadConfiguration } from "./configuration/load-configuration"
import { StatsCollector } from "./stats-collector"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = parseCmdlineArgs(process.argv)
    const configuration = await loadConfiguration(cmdLineConfig)
    const command = await instantiateCommand(commandName, cmdLineConfig, configuration, debugSubcommand)
    const formatter = instantiateFormatter(configuration, command)
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
  cliArgs: UserProvidedConfiguration,
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
      return new DynamicCommand(cliArgs)
    case "run":
      return new RunCommand(config)
    case "static":
      return new StaticCommand(cliArgs)
    case "unused":
      return await UnusedCommand.create(cliArgs)
    default:
      throw new UserError(`unknown command: ${commandName}`)
  }
}
