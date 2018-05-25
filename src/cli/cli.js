// @flow

const { red } = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./parse-cli-args')
const textRunner = require('../text-runner')
const path = require('path')
const printCodeFrame = require('../helpers/print-code-frame')
const UnprintedUserError = require('../errors/unprinted-user-error.js')
const UserError = require('../errors/user-error.js')

cliCursor.hide()

async function main () {
  var exitCode = 0
  try {
    const cliArgs = parseCliArgs(process.argv)
    const errors = await textRunner(cliArgs)
    exitCode = errors.length
  } catch (err) {
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      console.log(red(err))
      if (err.filePath) {
        const filePath = path.join(process.cwd(), err.filePath)
        printCodeFrame(console.log, filePath, err.line)
      }
    } else if (!(err instanceof UserError)) {
      console.log(err.stack)
    }
  }
  endChildProcesses()
  process.exit(exitCode)
}

main()
