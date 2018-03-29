// @flow

import type { Activity } from '../commands/run/activity.js'
const util = require('util')
const endChildProcesses = util.promisify(require('end-child-processes'))

// Stops the currently running console command.
module.exports = async function (activity: Activity) {
  activity.formatter.setTitle('stopping the long-running process')
  if (!global.runningProcess) {
    throw new Error('No running process found')
  }
  await endChildProcesses()
  global.runningProcess = null
}
