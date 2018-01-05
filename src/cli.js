// @flow

const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./helpers/parse-cli-args')
const textRunner = require('./text-runner')
const UnprintedUserError = require('./errors/unprinted-user-error.js')
const UserError = require('./errors/user-error.js')

cliCursor.hide()

async function main () {
  var exitCode = 0
  try {
    await textRunner(parseCliArgs(process.argv))
  } catch (err) {
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      console.log(red(err))
    } else if (!(err instanceof UserError)) {
      console.log(err.stack)
    }
  }
  endChildProcesses()
  process.exit(exitCode)
}

main()
