import * as cliCursor from "cli-cursor"
import * as color from "colorette"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { PrintedUserError } from "./errors/printed-user-error"
import { UnprintedUserError } from "./errors/unprinted-user-error"
import { printUserError } from "./helpers/print-user-error"
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
  const cliArgs = parseCmdlineArgs(process.argv)
  let errCount = 0
  try {
    switch (cliArgs.command) {
      case "help":
        await helpCommand()
        break
      case "scaffold":
        await scaffoldCommand(cliArgs.fileGlob)
        break
      case "setup":
        await setupCommand()
        break
      case "version":
        await versionCommand()
        break
      case "debug":
        errCount = await debugCommand(cliArgs)
        break
      case "dynamic":
        errCount = await dynamicCommand(cliArgs)
        break
      case "run":
        errCount = await runCommand(cliArgs)
        break
      case "static":
        errCount = await staticCommand(cliArgs)
        break
      case "unused":
        errCount = await unusedCommand(cliArgs)
        break
      default:
        console.log(color.red(`unknown command: ${cliArgs.command || ""}`))
        errCount = 1
    }
  } catch (err) {
    errCount = 1
    if (err instanceof UnprintedUserError) {
      printUserError(err)
    } else if (err instanceof PrintedUserError) {
      // nothing to do
    } else {
      console.log(err.stack)
    }
  }
  await endChildProcesses()
  process.exit(errCount)
}
main()
