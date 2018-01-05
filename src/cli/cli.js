// @flow

const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
console.log('1111111111111')
const parseCliArgs = require('../helpers/parse-cli-args')
console.log('2222222222222')
const textRunner = require('../text-runner')
console.log('3333333333333')
const UnprintedUserError = require('../errors/unprinted-user-error.js')
console.log('4444444444444')
const UserError = require('../errors/user-error.js')
console.log('5555555555555')

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
