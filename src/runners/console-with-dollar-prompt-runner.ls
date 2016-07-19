require! {
  'prelude-ls' : {capitalize}
  'xmldoc' : {XmlDocument}
}
debug = require('debug')('console-with-dollar-prompt-runner')


# Runs console command defined in a code block,
# where each line starts with "$ "
class ConsoleWithDollarPromptRunner

  ->
    @console-command = ''

  load: (node) ->
    @["_load#{capitalize node.type}"]? node


  run: ->
    debug "running #{@console-commands.join ' && '}"



  # Loads the commands to be executed from the given code block node
  _load-fence: (node) ->
    @console-commands = node.content.split '\n'



module.exports = ConsoleWithDollarPromptRunner
