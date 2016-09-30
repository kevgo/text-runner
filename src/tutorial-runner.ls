require! {
  './actions/action-manager' : ActionManager
  './configuration' : Configuration
  './formatters/colored-formatter' : ColoredFormatter
  'fs'
  'interpret'
  'liftoff' : Liftoff
  'path'
}


# Runs the tutorial in the given directory
class TutorialRunner

  ({@formatter = new ColoredFormatter} = {}) ->
    @actions = new ActionManager @formatter


  # Runs the given tutorial
  run: (@command, done) ->

    # Note: Liftoff runs here and not in the constructor
    #       because the constructor cannot run async operations
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({config-path}) ~>
        | !@has-command!  =>  return error-unknown-command!

        @configuration = new Configuration config-path

        CommandClass = require @command-path!
        new CommandClass({@configuration, @formatter, @actions}).run done


  command-path: ->
    path.join __dirname, '..' 'dist' 'commands', @command, "#{@command}-command.js"


  has-command: ->
    fs.stat-sync @command-path!



module.exports = TutorialRunner
