require! {
  './actions/action-manager' : ActionManager
  './configuration' : Configuration
  './formatters/icons-formatter' : IconsFormatter
  'fs'
  'interpret'
  'liftoff' : Liftoff
  'path'
}


# Runs the tutorial in the given directory
class TutorialRunner

  ({@formatter = new IconsFormatter} = {}) ->
    @actions = new ActionManager @formatter


  # Runs the given tutorial
  execute: (@command, done) ->

    # Note: Liftoff runs here and not in the constructor
    #       because the constructor cannot run async operations
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({config-path}) ~>
        | !@has-command!  =>  return done "unknown command: #{@command}"

        @configuration = new Configuration config-path

        CommandClass = require @command-path!
        new CommandClass({@configuration, @formatter, @actions}).run done


  command-path: ->
    path.join __dirname, '..' 'dist' 'commands', @command, "#{@command}-command.js"


  has-command: ->
    try
      fs.stat-sync @command-path!
      yes
    catch
      no



module.exports = TutorialRunner
