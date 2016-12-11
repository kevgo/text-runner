require! {
  './actions/action-manager' : ActionManager
  './configuration' : Configuration
  './formatters/formatter-manager' : FormatterManager
  'fs'
  'interpret'
  'liftoff' : Liftoff
  'path'
}


# Runs the tutorial in the given directory
class TutorialRunner

  (@constructor-args) ->


  # Runs the given tutorial
  execute: (@command, @args, done) ->

    # Note: Liftoff runs here and not in the constructor
    #       because the constructor cannot run async operations
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({config-path}) ~>
        | !@has-command! and !@has-markdown-file(@command)  =>  return done "unknown command: #{@command}"
        | !@has-command! and @has-markdown-file(@command)   =>  [@command, @args] = ['run', @command]
        | @has-command                                      =>  @args = @args?[0]

        @configuration = new Configuration config-path, @constructor-args
        (new FormatterManager).get-formatter @configuration.get('format'), (err, @formatter) ~>
          | err  =>  return done err
          @actions = new ActionManager @formatter
          CommandClass = require @command-path!
          new CommandClass({@configuration, @formatter, @actions}).run @args, done


  command-path: ->
    path.join __dirname, '..' 'dist' 'commands', @command, "#{@command}-command.js"


  has-command: ->
    try
      fs.stat-sync @command-path!
      yes
    catch
      no


  has-markdown-file: (filename) ->
    try
      fs.stat-sync filename
      yes
    catch
      no



module.exports = TutorialRunner
