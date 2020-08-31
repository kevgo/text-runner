import * as cliCursor from "cli-cursor"
import * as color from "colorette"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { UserError } from "./errors/user-error"
import { printUserError } from "./helpers/print-user-error"
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
import console = require("console")

cliCursor.hide()

async function main() {
  const { command, config } = parseCmdlineArgs(process.argv)
  let result = ExecuteResult.empty()
  try {
    switch (command) {
      case "help":
        await helpCommand()
        break
      case "scaffold":
        if (!config.fileGlob) {
          throw new Error("no action name given")
        }
        await scaffoldCommand(config.fileGlob, config.sourceDir || ".")
        break
      case "setup":
        await setupCommand()
        break
      case "version":
        await versionCommand()
        break
      case "debug":
        result = await debugCommand(config)
        break
      case "dynamic":
        result = await dynamicCommand(config)
        break
      case "run":
        result = await runCommand(config)
        break
      case "static":
        result = await staticCommand(config)
        break
      case "unused":
        result = await unusedCommand(config)
        break
      default:
        console.log(color.red(`unknown command: ${command || ""}`))
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
  await endChildProcesses()
  process.exit(result.errorCount)
}
main()
