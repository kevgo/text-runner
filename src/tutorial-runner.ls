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
  execute: (command, args, done) ->
    @_init (err) ~>
      | err                                                       =>  new HelpCommand({err}).run! ; done err
      | !@_has-command(command) and @_has-directory(command)      =>  @_command('run').run-directory command, done
      | !@_has-command(command) and @_has-markdown-file(command)  =>  @_command('run').run-file command, done
      | command is 'run' and @_has-markdown-file(args?[0])        =>  @_command('run').run-file args[0], done
      | command is 'run' and (args or []).length is 0             =>  @_command('run').run-all done
      | @_has-command(command)                                    =>  @_command(command).run done
      | otherwise                                                 =>  @_unknown-command command, done


  # Asynchronous initializer for this class
  # we need this because Lift is asyncronous
  _init: (done) ->
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({@config-path}) ~>
        @configuration = new Configuration @config-path, @constructor-args
        (new FormatterManager).get-formatter @configuration.get('format'), (err, @formatter) ~>
          @actions = new ActionManager @formatter
          done err


  _command: (command) ->
    CommandClass = require @_command-path command
    new CommandClass({@configuration, @formatter, @actions})


  _command-path: (command) ->
    path.join __dirname, '..' 'dist' 'commands', command, "#{command}-command.js"


  _has-command: (command) ->
    try
      fs.stat-sync @_command-path command
      yes
    catch
      no


  _has-directory: (dirname) ->
    try
      info = fs.stat-sync dirname
      info.is-directory!
    catch
      no


  _has-markdown-file: (filename) ->
    try
      info = fs.stat-sync filename
      info.is-file! and filename.ends-with '.md'
    catch
      no


  _unknown-command: (command, done) ->
    @formatter.error "unknown command: #{red command}"
    done new Error "unknown command: #{command}"


module.exports = TutorialRunner
