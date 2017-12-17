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
  new Liftoff name: 'text-run', config-name: 'text-run', extensions: interpret.extensions
    ..launch {}, ({config-path}) ~>
      try
        (new TextRunner {fast, format}, config-path).execute command, file, done
      catch
        done e


class TextRunner

  (@constructor-args, config-path) ->
    @configuration = new Configuration config-path, @constructor-args
    @formatter = (new FormatterManager).get-formatter @configuration.get('format')
    @actions = new ActionManager {@formatter, @configuration}


  # Tests the documentation according to the given command and arguments
  execute: (command, file, done) ->
    | command is 'run' and has-directory(file)     =>  @_command('run').run-directory file, done
    | command is 'run' and is-markdown-file(file)  =>  @_command('run').run-file file, done
    | command is 'run' and is-glob(file)           =>  @_command('run').run-glob file, done
    | command is 'run' and file                    =>  @_missing-file file, done
    | command is 'run'                             =>  @_command('run').run-all done
    | has-command(command)                         =>  @_command(command).run done
    | otherwise                                    =>  @_unknown-command command, done


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
