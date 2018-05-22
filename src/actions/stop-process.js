// @flow

import type { ActionArgs } from '../runners/action-args.js'

const util = require('util')
const endChildProcesses = util.promisify(require('end-child-processes'))

// Stops the currently running console command.
module.exports = async function (args: ActionArgs) {
  args.formatter.name('stopping the long-running process')
  if (!global.runningProcess) {
    throw new Error('No running process found')
  }
  global.runningProcess.kill()
  await endChildProcesses()
  global.runningProcess = null
}
