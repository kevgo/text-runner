// @flow

const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./helpers/parse-cli-args')
const textRunner = require('./text-runner')

cliCursor.hide()

async function main () {
  var err
  try {
    await textRunner(parseCliArgs(process.argv))
  } catch (e) {
    err = e
    if (err.message !== '1') console.log(red(err))
  }
  endChildProcesses()
  process.exit(err ? 1 : 0)
}
