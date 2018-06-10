// @flow

const { red } = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./parse-cli-args')
const textRunner = require('../text-runner')
const path = require('path')
const printCodeFrame = require('../helpers/print-code-frame')
const PrintedUserError = require('../errors/printed-user-error.js')
const UnprintedUserError = require('../errors/unprinted-user-error.js')

cliCursor.hide()

async function main () {
  const cliArgs = parseCliArgs(process.argv)
  const errors: Array<Error> = await textRunner(cliArgs)
  for (const err of errors) {
    if (err instanceof UnprintedUserError) {
      const uErr = (err: UnprintedUserError)
      if (uErr.filePath && uErr.line != null) {
        console.log(
          red(`${uErr.filePath}:${uErr.line} -- ${uErr.message || ''}`)
        )
      } else {
        console.log(red(uErr.message))
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
