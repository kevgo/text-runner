require! {
  'chalk' : {cyan, red}
  'observable-process' : ObservableProcess
  'prelude-ls' : {compact, find, map}
}
debug = require('debug')('console-with-dollar-prompt-runner')


module.exports  = ({nodes,formatter, searcher}, done) ->
  commands-to-run = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | !content  =>  'the block that defines console commands to run is empty')
  |> (.split '\n')
  |> map (.trim!)
  |> compact
  |> map trim-dollar
  |> (.join ' && ')

  formatter.start-activity "running console command: #{cyan commands-to-run}"
  new ObservableProcess(['bash', '-c', commands-to-run],
                        cwd: global.working-dir, stdout: formatter.stdout, stderr: formatter.stderr)
    ..on 'ended', (err) ~>
      | err  =>  formatter.activity-error err
      | _    =>  formatter.activity-success!
      done err, 1


# trims the leading dollar from the given command
function trim-dollar text
  text.replace /^\$?\s*/, ''
