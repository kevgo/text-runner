import * as cliCursor from "cli-cursor"
import { endChildProcesses } from "end-child-processes"
import { parseCmdlineArgs } from "./configuration/cli/parse-cmdline-args"
import { PrintedUserError } from "./errors/printed-user-error"
import { UnprintedUserError } from "./errors/unprinted-user-error"
import { printUserError } from "./helpers/print-user-error"
import { textRunner } from "./text-runner"
import { ExecuteResult } from "./runners/execute-result"

cliCursor.hide()

async function main() {
  const cliArgs = parseCmdlineArgs(process.argv)
  let result = ExecuteResult.empty()
  try {
    result = await textRunner(cliArgs)
  } catch (error) {
    if (error instanceof UnprintedUserError) {
      printUserError(error)
    } else if (error instanceof PrintedUserError) {
      // nothing to do
    } else if (error) {
      console.log(error.stack)
    }
  }
  await endChildProcesses()
  process.exit(result.errorCount)
}
main()
