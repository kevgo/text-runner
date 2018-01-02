// @flow

// Stops the currently running console command.
module.exports = function (args: {formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('stopping the long-running process')

  if (!global.runningProcess) {
    const error = 'No running process found'
    args.formatter.error(error)
    throw new Error(error)
  }

  global.runningProcess.kill()
  args.formatter.success()
}
