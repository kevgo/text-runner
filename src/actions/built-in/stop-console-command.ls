require! {
  'observable-process' : ObservableProcess
  'prelude-ls' : {compact, map}
}
debug = require('debug')('stop-console-command')


# Stops the currently running console command.
module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'stopping the long-running process'

  if !global.running-process
    error = 'No running process found'
    formatter.error error
    return done error

  global.running-process.kill!
  formatter.success!
  done!
