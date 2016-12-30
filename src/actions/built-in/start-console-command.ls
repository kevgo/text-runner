require! {
  '../../helpers/call-args'
  'chalk' : {bold, cyan}
  'observable-process' : ObservableProcess
  'prelude-ls' : {compact, map}
  '../../helpers/trim-dollar'
}
debug = require('debug')('console-with-dollar-prompt-runner')


# Runs the given commands on the console.
# Leaves the command running.
module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start 'starting a long-running process'

  commands-to-run = searcher.node-content type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | nodes.length > 2   =>  "found #{nodes.length} fenced code blocks. Expecting a maximum of 2."
    | !content  =>  'the block that defines console commands to run is empty'
  |> (.split '\n')
  |> map (.trim!)
  |> compact
  |> map trim-dollar
  |> (.join ' && ')

  formatter.refine "starting a long-running process: #{bold cyan commands-to-run}"
  global.start-console-command-output = ''
  global.running-process = new ObservableProcess(call-args(commands-to-run),
                                                 cwd: configuration.test-dir,
                                                 stdout: log(formatter.stdout),
                                                 stderr: formatter.stderr)
    ..on 'ended', (err) ~>
      global.running-process-ended = yes
      global.running-process-error = err

  formatter.success!
  done!


function log stdout
  write: (text) ->
    global.start-console-command-output += text
    stdout.write text
