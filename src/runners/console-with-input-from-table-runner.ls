require! {
  'dim-console'
  'observable-process' : ObservableProcess
  'path'
  'prelude-ls' : {capitalize}
  'xmldoc' : {XmlDocument}
}
debug = require('debug')('console-with-input-from-table-runner')


# Runs a console command given as a code block
# with textual input from a table.
#
# The first column of the table contains the output text to wait for,
# the last column contains the text to enter.
class ConsoleWithInputFromTableRunner

  (@world) ->

    # the commands to run
    @commands = []

    # The text to enter.
    # structured as pairs of strings,
    # first the text to wait for in the output,
    # then the text to enter.
    @input = []


  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: (done) ->
    command = ['bash', '-c', @commands.join ' && ']
    debug """running "#{command}" with input '#{@input}'"""
    @process = new ObservableProcess(command,
                                     cwd: @world.app-dir,
                                     console: dim-console.console)
      ..on 'ended', done




  # Loads the commands to be executed from the given code block node
  _load-fence: (node) ->
    | @commands.length > 0  =>  throw new Error 'Duplicate console command found'

    @commands = node.content.trim!.split '\n'


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



module.exports = ConsoleWithInputFromTableRunner
