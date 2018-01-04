// @flow

// Stops the currently running console command.
module.exports = function (activity: Activity) {
  activity.formatter.action('stopping the long-running process')

  if (!global.runningProcess) {
    throw new Error('No running process found')
  }

  global.runningProcess.kill()
}
