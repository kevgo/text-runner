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

    # the command to run on the console
    @console-commands = ''

    # the text to enter
    #
    # pairs of strings,
    # first the text to wait for in the output,
    # then the text to enter.
    @input = []


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  # Runs all commands given in the current block
  run: (done) ->
    | !@console-commands  =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: no console commands to run found"
        process.exit 1

    console.log "#{@markdown-file-path}:#{@markdown-line} -- running console commands: #{cyan @console-commands}"
    @process = new ObservableProcess ['bash', '-c', @console-commands], console: dim-console.console
      ..on 'ended', (err) ->
        done err, 1



  # enters the content of the given table row into the running process
  _enter-table-row: (row, done) ~>
    text-to-enter = row[*-1]
    if row.length > 1
      text-to-wait-for = row[0]
    @process.



  # Loads the commands to be executed from the given code block node
  _load-fence: (node) ->
    | node.content.trim! is ''  =>
        console.log red "#{@markdown-file-path}:#{@markdown-line} -- Error: the block that defines console commands to run is empty"
        process.exit 1

    commands = node.content.split '\n'
    commands = [@_trim-dollar(command.trim!) for command in commands]
    commands = compact commands
    @console-commands = commands.join ' && '


  # Loads the input data from the given HTML table node
  _load-htmlblock: (node) ->
    | @input.length > 1  =>  throw new Error 'Duplicate user input table found'

    xml-document = new XmlDocument node.content
    @input = [@_TR-data(tr) for tr in xml-document.children when @_contains-TD-cells(tr)]


  # Returns whether the given TR contains TD cells
  _contains-TD-cells: (tr) ->
    [child.name for child in tr.children].includes 'td'


  # Returns the output to wait for and the input to enter for the given TR
  _TR-data: (tr) ->
    contents = [child.val for child in tr.children]
    [contents[0], contents[*-1]]


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
