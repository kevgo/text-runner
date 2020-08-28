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
  const results = await textRunner(cliArgs)
  const errors = results.map((result) => result.error).filter((error) => error) as Error[]
  for (const error of errors) {
    if (error instanceof UnprintedUserError) {
      printUserError(error)
    } else if (error instanceof PrintedUserError) {
      // nothing to do
    } else if (error) {
      console.log(error.stack)
    }
  }
  await endChildProcesses()
  process.exit(errors.length)
}
main()
