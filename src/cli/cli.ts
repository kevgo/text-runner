import chalk from 'chalk'
import cliCursor from 'cli-cursor'
import endChildProcesses from 'end-child-processes'
import parseCliArgs from './parse-cli-args'
import textRunner from '../text-runner'
import path from 'path'
import printCodeFrame from '../helpers/print-code-frame'
import PrintedUserError from '../errors/printed-user-error.js'
import UnprintedUserError from '../errors/unprinted-user-error.js'

cliCursor.hide()

async function main() {
  const cliArgs = parseCliArgs(process.argv)
  const errors: Array<Error> = await textRunner(cliArgs)
  for (const err of errors) {
    if (err instanceof UnprintedUserError) {
      const uErr = <UnprintedUserError>err
      if (uErr.filePath && uErr.line != null) {
        console.log(
          chalk.red(`${uErr.filePath}:${uErr.line} -- ${uErr.message || ''}`)
        )
      } else {
        console.log(chalk.red(uErr.message))
      }
      const filePath = path.join(process.cwd(), err.filePath || '')
      printCodeFrame(console.log, filePath, err.line)
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
