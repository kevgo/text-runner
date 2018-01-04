// @flow

const UnprintedUserError = require('../../errors/unprinted-user-error.js')

// Stops the currently running console command.
module.exports = function (args: {formatter: Formatter, searcher: Searcher}) {
  args.formatter.start('stopping the long-running process')

  if (!global.runningProcess) {
    throw new UnprintedUserError('No running process found')
  }

  global.runningProcess.kill()
  args.formatter.success()
}
