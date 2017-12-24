// @flow

const {red} = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./helpers/parse-cli-args')
// $FlowFixMe
const pkg = require('../package.json')
const textRunner = require('./text-runner')
// $FlowFixMe
const updateNotifier = require('update-notifier')

updateNotifier({pkg}).notify()
cliCursor.hide()

textRunner(parseCliArgs(process.argv), (err) => {
  if (err && err.message !== 1) console.log(red(err))
  endChildProcesses()
  process.exit(err ? 1 : 0)
})
