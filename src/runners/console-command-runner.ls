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

  (@markdown-file-path, @markdown-line) ->
    @console-commands = ''


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  # Runs all commands given in the current block
  run: (done) ->
    | !@console-commands  =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: no console commands to run found"
        process.exit 1

    console.log "#{@markdown-file-path}:#{@markdown-line} -- running console commands: #{cyan @console-commands}"
    new ObservableProcess ['bash', '-c', @console-commands], console: dim-console.console
      ..on 'ended', (err) ->
        done err, 1


  # Loads the commands to be executed from the given code block node
  _load-fence: (node) ->
    | node.content.trim! is ''  =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: the block that defines console commands to run is empty"
        process.exit 1

    commands = node.content.split '\n'
    commands = [@_trim-dollar(command.trim!) for command in commands]
    commands = compact commands
    @console-commands = commands.join ' && '


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
