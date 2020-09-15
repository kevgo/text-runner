import * as cliCursor from "cli-cursor"
import * as color from "colorette"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { UserError } from "./errors/user-error"
import { printUserError } from "./errors/print-user-error"
import { ExecuteResult } from "./runners/execute-result"
import { debugCommand } from "./commands/debug"
import { dynamicCommand } from "./commands/dynamic"
import { helpCommand } from "./commands/help"
import { runCommand } from "./commands/run"
import { scaffoldCommand } from "./commands/scaffold"
import { setupCommand } from "./commands/setup"
import { staticCommand } from "./commands/static"
import { unusedCommand } from "./commands/unused"
import { versionCommand } from "./commands/version"

cliCursor.hide()

async function main() {
  const { commandName, cmdLineConfig } = parseCmdlineArgs(process.argv)
  let result = ExecuteResult.empty()
  try {
    switch (commandName) {
      case "help":
        await helpCommand()
        break
      case "scaffold":
        await scaffoldCommand(cmdLineConfig)
        break
      case "setup":
        result = await setupCommand(cmdLineConfig)
        break
      case "version":
        await versionCommand()
        break
      case "debug":
        result = await debugCommand(cmdLineConfig)
        break
      case "dynamic":
        result = await dynamicCommand(cmdLineConfig)
        break
      case "run":
        result = await runCommand(cmdLineConfig)
        break
      case "static":
        result = await staticCommand(cmdLineConfig)
        break
      case "unused":
        result = await unusedCommand(cmdLineConfig)
        break
      default:
        console.log(color.red(`unknown command: ${cmdLineConfig || ""}`))
        result.errorCount += 1
    }
  } catch (err) {
    result.errorCount += 1
    if (err instanceof UserError) {
      printUserError(err)
    } else {
      console.log(err.stack)
    }
  }
  if (result.warnings.length > 0) {
    for (const warning of result.warnings) {
      console.log(color.magenta(warning))
    }
  }
  await endChildProcesses()
  process.exit(result.errorCount)
}
main()
