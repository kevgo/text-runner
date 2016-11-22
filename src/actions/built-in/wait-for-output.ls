require! {
  'chalk' : {bold, cyan}
}
debug = require('debug')('console-with-dollar-prompt-runner')


# Waits until the currently running console command produces the given output
module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'waiting for output'

  expected-output = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | nodes.length > 1   =>  "found #{nodes.length} fenced code blocks. Expecting a maximum of 1."
    | !content  =>  'the block that defines console commands to run is empty')
  |> (.trim!)

  formatter.refine "waiting for output: #{bold cyan expected-output}"

  global.running-process.wait expected-output, ->
    formatter.success!
    done!
