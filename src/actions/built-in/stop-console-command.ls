require! {
  'observable-process' : ObservableProcess
  'prelude-ls' : {compact, map}
}
debug = require('debug')('console-with-dollar-prompt-runner')


# Stops the currently running console command.
module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'stopping the long-running process'

  if !global.running-process
    formatter.error "No running process found"
    return done null, 1

  global.running-process.kill!
  formatter.success!
  done null, 1
