import cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import * as textRunner from "text-runner-core"

import * as cmdLine from "./cmdline.js"
import * as commands from "./commands/index.js"
import * as configFile from "./config-file.js"
import * as formatters from "./formatters/index.js"

export async function main() {
  cliCursor.hide()

  let errorCount = 0
  try {
    const { commandName, cmdLineConfig, debugSubcommand } = cmdLine.parse(process.argv)
    const fileConfig = await configFile.load(cmdLineConfig)
    const userConfig = fileConfig.merge(cmdLineConfig)
    const command = commands.instantiate(commandName, userConfig, debugSubcommand)
    const formatter = formatters.instantiate(userConfig.formatterName || "detailed", command)
    const activityCollector = new textRunner.ActivityCollector(command)
    await command.execute()
    const results = activityCollector.results()
    if (["dynamic", "run", "static"].includes(commandName)) {
      formatter.finish({ results })
    }
    errorCount = results.errorCount()
  } catch (e) {
    errorCount += 1
    if (e instanceof textRunner.UserError) {
      formatters.printUserError(e)
    } else if (e instanceof Error) {
      console.log(e.message)
      console.log(e.stack)
    } else {
      console.log(e)
    }
  } finally {
    await endChildProcesses()
  }
  process.exit(errorCount)
}
