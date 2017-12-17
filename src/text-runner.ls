require! {
  './actions/action-manager' : ActionManager
  'chalk' : {red}
  './commands/help/help-command' : HelpCommand
  './configuration' : Configuration
  './formatters/formatter-manager' : FormatterManager
  'fs'
  'interpret'
  'is-glob'
  'liftoff' : Liftoff
  'path'
}


# Tests the documentation in the given directory
class TextRunner

  (@constructor-args) ->


  # Tests the documentation according to the given command and arguments
  execute: (command, file, done) ->
    @_init (err) ~>
      | err                                            =>  new HelpCommand({err}).run! ; done err
      | command is 'run' and @_has-directory(file)     =>  @_command('run').run-directory file, done
      | command is 'run' and @_is-markdown-file(file)  =>  @_command('run').run-file file, done
      | command is 'run' and is-glob(file)             =>  @_command('run').run-glob file, done
      | command is 'run' and file                      =>  @_missing-file file, done
      | command is 'run'                               =>  @_command('run').run-all done
      | @_has-command(command)                         =>  @_command(command).run done
      | otherwise                                      =>  @_unknown-command command, done


  # Asynchronous initializer for this class
  # we need this because Lift is asyncronous
  _init: (done) ->
    new Liftoff name: 'text-run', config-name: 'text-run', extensions: interpret.extensions
      ..launch {}, ({@config-path}) ~>
        @configuration = new Configuration @config-path, @constructor-args
        (new FormatterManager).get-formatter @configuration.get('format'), (err, @formatter) ~>
          @actions = new ActionManager {@formatter, @configuration}
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


  _is-markdown-file: (filename) ->
    try
      filename.ends-with '.md' and fs.stat-sync(filename).is-file!
    catch
      no


  _has-markdown-files: (glob-expression) ->
    try
      glob.sync glob-expression
          .any -> it.ends-with '.md' and fs.stat-sync(it).is-file!
    catch
      no


  _missing-file: (filename, done) ->
    error-message = "file or directory does not exist: #{red filename}"
    @formatter.error error-message
    done new Error error-message


  _unknown-command: (command, done) ->
    @formatter.error "unknown command: #{red command}"
    done new Error "unknown command: #{command}"


module.exports = TextRunner
