// @flow

const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./helpers/parse-cli-args')
const textRunner = require('./text-runner')

cliCursor.hide()

async function main () {
  var exitCode = 0
  try {
    await textRunner(parseCliArgs(process.argv))
  } catch (err) {
    exitCode = 1
    if (err.message !== '1') {
      console.log(red(err))
    }
  }
  endChildProcesses()
  process.exit(exitCode)
}

main()
