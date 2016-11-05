require! {
  'chalk' : {cyan, red}
  'observable-process' : ObservableProcess
  'path'
  'prelude-ls' : {compact, find, head, map, tail, values}
  'xml2js' : {parse-string}
}
debug = require('debug')('console-with-dollar-prompt-runner')


module.exports  = ({formatter, searcher, configuration}, done) ->
  formatter.start 'running console command'

  commands-to-run = searcher.node-content(type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no code blocks found'
    | !content  =>  'the block that defines console commands to run is empty')
  |> (.split '\n')
  |> map (.trim!)
  |> compact
  |> map trim-dollar
  |> map make-global(configuration?.file-data?.globals)
  |> (.join ' && ')

  input-text = searcher.node-content type: 'htmlblock'
  get-input input-text, formatter, (input) ->
    formatter.refine "running console command: #{cyan commands-to-run}"
    process = new ObservableProcess(['bash', '-c', commands-to-run],
                                    cwd: global.working-dir, stdout: formatter.stdout, stderr: formatter.stderr)
      ..on 'ended', (err) ~>
        | err  =>  formatter.error err
        | _    =>  formatter.success!
        done err, 1

    for input-line in input
      enter process, input-line


function enter process, {text-to-wait = '', input}
  process.wait text-to-wait, ->
    process.enter input


function get-input text, formatter, done
  if !text then return done ''
  parse-string text, (err, xml) ->
    | err  =>  return formatter.error err
    result = for tr in xml.table.tr
      if tr.td
        if tr.td.length is 1
          text-to-wait: null, input: tr.td[0]
        else
          text-to-wait: tr.td[0], input: tr.td[*-1]
    done result


function make-global globals = {}
  (command) ->
    command-parts = command.split ' '
    if replacement = globals[head command-parts]
      "#{path.join '..', replacement} #{tail(command-parts).join ' '}"
    else
      command



# trims the leading dollar from the given command
function trim-dollar text
  text.replace /^\$?\s*/, ''
