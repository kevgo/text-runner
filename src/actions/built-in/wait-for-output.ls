require! {
  'async'
  'chalk' : {bold, cyan}
  'prelude-ls' : {compact, map, split}
}


# Waits until the currently running console command produces the given output
module.exports  = ({formatter, searcher}, done) ->
  formatter.start 'waiting for output of the running console process'

  expected-output = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | nodes.length > 1   =>  "found #{nodes.length} fenced code blocks. Expecting a maximum of 1."
    | !content  =>  'the block that defines console commands to run is empty')

  expected-lines = expected-output  |>  (.split '\n')
                                    |>  map (.trim!)
                                    |>  compact

  async.each-series expected-lines, wait-function(formatter), (err) ->
    | err  =>  formatter.error! ; done err
    | _    =>  formatter.success! ; done!


function wait-function formatter
  (line, done) ->
    formatter.output "waiting for #{line}"
    global.running-process.wait line, done
