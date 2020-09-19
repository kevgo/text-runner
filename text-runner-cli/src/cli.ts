import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { printUserError } from "./print-user-error"
import { instantiateFormatter } from "./formatters/instantiate"
import * as cmdLineArgs from "./configuration/cmdline-args"
import * as configFile from "./configuration/config-file"
import * as commands from "./commands/commands"
import { StatsCollector } from "./helpers/stats-collector"
import { UserError } from "text-runner-core"

cliCursor.hide()

async function main() {
  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = cmdLineArgs.parse(process.argv)
    const fileConfig = await configFile.load(cmdLineConfig)
    const userConfig = fileConfig.merge(cmdLineConfig)
    const command = await commands.instantiate(commandName, userConfig, debugSubcommand)
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
