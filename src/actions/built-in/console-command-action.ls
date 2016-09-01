require! {
  'chalk' : {cyan, red}
  'observable-process' : ObservableProcess
  'prelude-ls' : {compact, find, map}
  'xml2js' : {parse-string}
}
debug = require('debug')('console-with-dollar-prompt-runner')


module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'running console command'

  commands-to-run = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | !content  =>  'the block that defines console commands to run is empty')
  |> (.split '\n')
  |> map (.trim!)
  |> compact
  |> map trim-dollar
  |> (.join ' && ')

  input-text = searcher.node-content type: 'htmlblock'
  parse-xml input-text, formatter, (input) ->

    formatter.refine "running console command: #{cyan commands-to-run}"
    new ObservableProcess(['bash', '-c', commands-to-run],
                          cwd: global.working-dir, stdout: formatter.stdout, stderr: formatter.stderr)
      ..on 'ended', (err) ~>
        | err  =>  formatter.error err
        | _    =>  formatter.success!
        done err, 1

    console.log input


function parse-xml text, formatter, done
  if !text then return done ''
  parse-string text, (err, result) ->
    | err  =>  formatter.error err
    done result



# trims the leading dollar from the given command
function trim-dollar text
  text.replace /^\$?\s*/, ''
