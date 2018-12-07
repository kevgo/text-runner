import chalk from 'chalk'
import cliCursor from 'cli-cursor'
import endChildProcesses from 'end-child-processes'
import path from 'path'
import PrintedUserError from '../errors/printed-user-error'
import UnprintedUserError from '../errors/unprinted-user-error'
import printCodeFrame from '../helpers/print-code-frame'
import textRunner from '../text-runner'
import parseCliArgs from './parse-cli-args'

cliCursor.hide()

async function main() {
  const cliArgs = parseCliArgs(process.argv)
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
  endChildProcesses()
  process.exit(errors.length)
}
main()

function printUserError(err: UnprintedUserError) {
  const uErr = err as UnprintedUserError
  if (uErr.filePath && uErr.line != null) {
    console.log(
      chalk.red(`${uErr.filePath}:${uErr.line} -- ${uErr.message || ''}`)
    )
  } else {
    console.log(chalk.red(uErr.message))
  }
  const filePath = path.join(process.cwd(), err.filePath || '')
  printCodeFrame(console.log, filePath, err.line)
}
