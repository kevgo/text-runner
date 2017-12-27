// @flow

const ObservableProcess = require('observable-process')
const debug = require('debug')('stop-console-command')

// Stops the currently running console command.
module.exports = function (args: {formatter: Formatter, searcher: Searcher}, done: DoneFunction) {
  args.formatter.start('stopping the long-running process')

  if (!global.runningProcess) {
    const error = 'No running process found'
    args.formatter.error(error)
    done(new Error(error))
    return
  }

  global.runningProcess.kill()
  args.formatter.success()
  done()
}
