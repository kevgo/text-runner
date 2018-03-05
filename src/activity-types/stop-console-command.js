// @flow

import type { Activity } from '../commands/run/activity.js'

// Stops the currently running console command.
module.exports = function(activity: Activity) {
  activity.formatter.setTitle('stopping the long-running process')
  if (!global.runningProcess) {
    throw new Error('No running process found')
  }
  global.runningProcess.kill()
  global.runningProcess = null
}
