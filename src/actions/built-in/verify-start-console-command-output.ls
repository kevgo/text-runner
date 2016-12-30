require! {
  'chalk' : {cyan, red}
  'prelude-ls' : {compact, filter, map, reject}
  'jsdiff-console'
}
debug = require('debug')('textrun:actions:verify-start-console-command')


# Runs the given commands on the console.
# Waits until the command is finished.
module.exports  = ({configuration, formatter, searcher}) ->
  formatter.start 'verifying the output of the last started console command'

  expected-lines = searcher.node-content type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no fenced blocks found'
    | nodes.length > 1   =>  "found #{nodes.length} fenced code blocks. Expecting only one."
    | !content  =>  'empty fenced block found'
  |> (.split '\n')
  |> map (.trim!)
  |> compact

  actual-lines = global.start-console-command-output.split '\n'
  |> map (.trim!)
  |> compact

  common-lines = actual-lines |> filter -> expected-lines.includes it
  jsdiff-console expected-lines, common-lines
  formatter.success!
