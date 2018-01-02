// @flow

// Stops the currently running console command.
module.exports = function (args: {formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('stopping the long-running process')

  if (!global.runningProcess) {
    args.formatter.error('No running process found')
    throw new Error('1')
  }

  global.runningProcess.kill()
  global.runningProcess = null
  args.formatter.success()
}
