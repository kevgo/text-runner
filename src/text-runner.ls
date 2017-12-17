require! {
  './actions/action-manager' : ActionManager
  'chalk' : {red}
  './helpers/command-path'
  './commands/help/help-command' : HelpCommand
  './configuration' : Configuration
  './formatters/formatter-manager' : FormatterManager
  'fs'
  './helpers/has-command'
  './helpers/has-directory'
  './helpers/has-markdown-files'
  'interpret'
  'is-glob'
  './helpers/is-markdown-file'
  'liftoff' : Liftoff
  'path'
}


# Tests the documentation in the given directory
module.exports = ({command, file, fast, format}, done) ->
  text-runner = new TextRunner {fast, format}
  text-runner.execute command, file, done


class TextRunner

  (@constructor-args) ->


  # Tests the documentation according to the given command and arguments
  execute: (command, file, done) ->
    @_init (err) ~>
      | err                                          =>  new HelpCommand({err}).run! ; done err
      | command is 'run' and has-directory(file)     =>  @_command('run').run-directory file, done
      | command is 'run' and is-markdown-file(file)  =>  @_command('run').run-file file, done
      | command is 'run' and is-glob(file)           =>  @_command('run').run-glob file, done
      | command is 'run' and file                    =>  @_missing-file file, done
      | command is 'run'                             =>  @_command('run').run-all done
      | has-command(command)                         =>  @_command(command).run done
      | otherwise                                    =>  @_unknown-command command, done


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
    CommandClass = require command-path command
    new CommandClass({@configuration, @formatter, @actions})


  _missing-file: (filename, done) ->
    error-message = "file or directory does not exist: #{red filename}"
    @formatter.error error-message
    done new Error error-message


  _unknown-command: (command, done) ->
    @formatter.error "unknown command: #{red command}"
    done new Error "unknown command: #{command}"
