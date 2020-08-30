import * as cliCursor from "cli-cursor"
import * as color from "colorette"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { PrintedUserError } from "./errors/printed-user-error"
import { UnprintedUserError } from "./errors/unprinted-user-error"
import { printUserError } from "./helpers/print-user-error"
import { ExecuteResult } from "./runners/execute-result"
import { debugCommand } from "./text-runner"
import { dynamicCommand } from "./text-runner"
import { helpCommand } from "./text-runner"
import { runCommand } from "./text-runner"
import { scaffoldCommand } from "./text-runner"
import { setupCommand } from "./text-runner"
import { staticCommand } from "./text-runner"
import { unusedCommand } from "./text-runner"
import { versionCommand } from "./text-runner"
import console = require("console")
import { error } from "console"

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
        await scaffoldCommand(config.fileGlob)
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
    if (err instanceof UnprintedUserError) {
      printUserError(err)
    } else if (err instanceof PrintedUserError) {
      // nothing to do
    } else {
      console.log(err.stack)
    }
  }
  await endChildProcesses()
  process.exit(result.errorCount)
}
main()
