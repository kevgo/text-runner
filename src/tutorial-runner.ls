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

  ({@command = 'run', @formatter = new ColoredFormatter} = {}) ->
    @actions = new ActionManager @formatter


  # Runs the given tutorial
  run: (done) ->

    # Note: Liftoff runs here and not in the constructor
    #       because the constructor cannot run async operations
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({config-path}) ~>
        | !@has-command!  =>  return error-unknown-command!

        @configuration = new Configuration config-path
        @run-command done


  command-path: ->
    path.join __dirname, '..' 'dist' 'commands', @command, "#{@command}-command.js"


  has-command: ->
    fs.stat-sync @command-path!


  run-command: (done) ->
    Command = require @command-path!
    new Command({@configuration, @formatter, @actions}).run done



module.exports = TutorialRunner
