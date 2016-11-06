require! {
  './actions/action-manager' : ActionManager
  './configuration' : Configuration
  './formatters/iconic-formatter' : IconicFormatter
  'fs'
  'interpret'
  'liftoff' : Liftoff
  'path'
}


# Runs the tutorial in the given directory
class TutorialRunner

  (@args) ->


  # Runs the given tutorial
  execute: (@command, done) ->

    # Note: Liftoff runs here and not in the constructor
    #       because the constructor cannot run async operations
    new Liftoff name: 'tut-run', config-name: 'tut-run', extensions: interpret.extensions
      ..launch {}, ({config-path}) ~>
        | !@has-command!  =>  return done "unknown command: #{@command}"

        @configuration = new Configuration config-path, @args
        @formatter = @configuration.get 'formatter'
        if typeof @formatter is 'string'
          try
            FormatterClass = require("./formatters/#{@formatter}-formatter")
            @formatter = new FormatterClass
          catch
            console.log "Error: Unknown formatter: '#{@formatter}'"
            process.exit 1
        @actions = new ActionManager(@formatter)
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
