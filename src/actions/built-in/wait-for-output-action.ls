debug = require('debug')('console-with-dollar-prompt-runner')


# Waits until the currently running console command produces the given output
module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'starting a long-running process'

  expected-output = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | nodes.length > 1   =>  "found #{nodes.length} fenced code blocks. Expecting a maximum of 1."
    | !content  =>  'the block that defines console commands to run is empty')

  global.running-process.wait expected-output, ->
    done null, 1
