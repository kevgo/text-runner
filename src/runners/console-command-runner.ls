require! {
  'chalk' : {cyan, red}
  'dim-console'
  'observable-process' : ObservableProcess
  'prelude-ls' : {capitalize, compact}
  'xmldoc' : {XmlDocument}
}
debug = require('debug')('console-with-dollar-prompt-runner')


# Runs console command defined in a code block,
# where each line starts with "$ "
class ConsoleCommandRunner

  (@markdown-line, @formatter) ->
    @commands-to-run = ''

    # the line of the node that is currently being parsed
    @currently-loaded-node-line = 1


  load: (node) ->
    @currently-loaded-node-line = node.lines[0] + 1 if node.lines
    @["_load#{capitalize node.type}"]? node


  # Runs all commands given in the current block
  run: (done) ->
    @formatter.start-block @markdown-line
    if !@commands-to-run then @formatter.parse-block-error 'no console commands to run found', @currently-loaded-node-line
    @formatter.start-activity "running console command: #{cyan @commands-to-run}"
    new ObservableProcess ['bash', '-c', @commands-to-run], console: dim-console.console
      ..on 'ended', (err) ~>
        | err  =>  @formatter.activity-error err
        | _    =>  @formatter.activity-success!
        done err, 1


  # Loads the commands to be executed from the given code block node
  _load-fence: (node) ->
    | node.content.trim! is ''  =>  @formatter.parse-block-error 'the block that defines console commands to run is empty', @currently-loaded-node-line
    @commands-to-run = ([@_trim-dollar(command.trim!) for command in node.content.split '\n'] |> compact).join ' && '


  # Trims the leading dollar from the given command
  _trim-dollar: (text) ->
    | !text  =>  return
    regex = /^(\$\s*)?(.+)$/
    matches = text.match(regex)
    if matches.length is 1
      matches[0]
    else
      matches[2]



module.exports = ConsoleCommandRunner
