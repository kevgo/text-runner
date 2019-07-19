import cliCursor from 'cli-cursor'
import color from 'colorette'
import { endChildProcesses } from 'end-child-processes'
import path from 'path'
import { PrintedUserError } from '../errors/printed-user-error'
import { UnprintedUserError } from '../errors/unprinted-user-error'
import { printCodeFrame } from '../helpers/print-code-frame'
import { textRunner } from '../text-runner'
import { parseCmdlineArgs } from './parse-cmdline-args'

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

function printUserError(err: UnprintedUserError) {
  const uErr = err as UnprintedUserError
  if (uErr.filePath && uErr.line != null) {
    console.log(
      color.red(`${uErr.filePath}:${uErr.line} -- ${uErr.message || ''}`)
    )
  } else {
    console.log(color.red(uErr.message))
  }
  const filePath = path.join(process.cwd(), err.filePath || '')
  printCodeFrame(console.log, filePath, err.line)
}
