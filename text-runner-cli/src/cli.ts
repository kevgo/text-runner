import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { printUserError } from "./print-user-error"
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
import { instantiateFormatter } from "./formatters/instantiate"
import { parseCmdlineArgs } from "./parse-cmdline-args"
import { Configuration } from "./user-provided-configuration"
import { determineConfigFilename } from "./config-file/determine-config-filename"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = parseCmdlineArgs(process.argv)
    const fileConfig = await Configuration.fromConfigFile(await determineConfigFilename(cmdLineConfig))
    const userConfig = fileConfig.merge(cmdLineConfig)
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
  userConfig: Configuration,
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
