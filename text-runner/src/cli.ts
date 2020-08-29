import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { PrintedUserError } from "./errors/printed-user-error"
import { UnprintedUserError } from "./errors/unprinted-user-error"
import { printUserError } from "./helpers/print-user-error"
import { textRunner } from "./text-runner"

cliCursor.hide()

async function main() {
  const cliArgs = parseCmdlineArgs(process.argv)
  let exitCode = 0
  try {
    exitCode = await textRunner(cliArgs)
  } catch (err) {
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      printUserError(err)
      // TODO: remove PrintedUserError class
    } else if (err instanceof PrintedUserError) {
      // nothing to do
    } else {
      console.log(err.stack)
    }
  }
  await endChildProcesses()
  process.exit(exitCode)
}
main()
