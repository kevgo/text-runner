import cliCursor from 'cli-cursor'
import { endChildProcesses } from 'end-child-processes'
import { PrintedUserError } from '../errors/printed-user-error'
import { UnprintedUserError } from '../errors/unprinted-user-error'
import { textRunner } from '../text-runner'
import { parseCmdlineArgs } from './parse-cmdline-args'
import { printUserError } from './print-user-error'

cliCursor.hide()

async function main() {
  const cliArgs = parseCmdlineArgs(process.argv)
  const errors: Error[] = await textRunner(cliArgs)
  for (const err of errors) {
    if (err instanceof UnprintedUserError) {
      printUserError(err)
    } else if (err instanceof PrintedUserError) {
      // nothing to do
    } else {
      console.log(err.stack)
    }
  }
  await endChildProcesses()
  process.exit(errors.length)
}
main()
