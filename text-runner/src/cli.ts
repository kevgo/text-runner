import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { UserError } from "./errors/user-error"
import { printUserError } from "./errors/print-user-error"
import { DebugCommand } from "./commands/debug"
import { DynamicCommand } from "./commands/dynamic"
import { HelpCommand } from "./commands/help"
import { RunCommand } from "./commands/run"
import { ScaffoldCommand } from "./commands/scaffold"
import { SetupCommand } from "./commands/setup"
import { StaticCommand } from "./commands/static"
import { UnusedCommand } from "./commands/unused"
import { VersionCommand } from "./commands/version"
import { loadConfiguration } from "./configuration/load-configuration"
import { instantiateFormatter } from "./formatters/instantiate"
import { Configuration } from "./configuration/types/configuration"
import { UserProvidedConfiguration } from "./configuration/types/user-provided-configuration"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    // step 1: determine configuration
    const { commandName, cmdLineConfig } = parseCmdlineArgs(process.argv)
    const config = await loadConfiguration(cmdLineConfig)

    // step 2: create command instance
    const command = instantiateCommand(commandName, config, cmdLineConfig)

    // step 3: create formatter and attach to command instance
    const formatter = instantiateFormatter(config, command)

    // step 4: execute the command
    await command.execute()
    errorCount += formatter.errorCount()
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

function instantiateCommand(commandName: string, config: Configuration, cliArgs: UserProvidedConfiguration) {
  switch (commandName) {
    case "help":
      return new HelpCommand()
    case "scaffold":
      return new ScaffoldCommand(config, cliArgs.scaffoldSwitches || {})
    case "setup":
      return new SetupCommand(config)
    case "version":
      return new VersionCommand()
    case "debug":
      return new DebugCommand(config, cliArgs.debugSwitches || {})
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
