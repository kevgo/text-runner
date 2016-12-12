require! {
  './actions/action-manager' : ActionManager
  'chalk' : {red}
  './commands/help/help-command' : HelpCommand
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
        | !@has-command! and !@has-markdown-file(@command)  =>  return @_unknown-command done
        | !@has-command! and @has-markdown-file(@command)   =>  [@command, @args] = ['run', @command]
        | @has-command                                      =>  @args = @args?[0]

        @configuration = new Configuration config-path, @constructor-args
        (new FormatterManager).get-formatter @configuration.get('format'), (err, @formatter) ~>
          | err  =>  new HelpCommand({err}).run! ; return done err
          @actions = new ActionManager @formatter
          try
            CommandClass = require @command-path!
            new CommandClass({@configuration, @formatter, @actions}).run @args, done
          catch
            console.log e
            done e


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


  _unknown-command: (done) ->
    console.log "unknown command: #{red @command}"
    done new Error "unknown command: #{@command}"


module.exports = TutorialRunner
