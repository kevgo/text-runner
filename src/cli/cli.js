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
  console.log('666666666666')
  var exitCode = 0
  try {
    await textRunner(parseCliArgs(process.argv))
    console.log('777777777777')
  } catch (err) {
    console.log('88888888888')
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      console.log('99999999999')
      console.log(red(err))
    } else if (!(err instanceof UserError)) {
      console.log('AAAAAAAAAAA')
      console.log(err.stack)
    }
  }
  console.log('BBBBBBBBB')
  endChildProcesses()
  console.log('CCCCCCCCCC')
  process.exit(exitCode)
}

main()
