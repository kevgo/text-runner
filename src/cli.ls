require! {
  'cli-cursor'
  './commands/help/help-command' : HelpCommand
  'minimist'
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!
cli-cursor.hide!
argv = minimist process.argv.slice(2)

command = argv._[0] or 'run'
formatter = null
if argv.format
  Formatter = require("./formatters/#{argv.format}-formatter")
  formatter = new Formatter
new TutorialRunner({formatter}).execute command, (err) ->
  if err
    new HelpCommand({err}).run!
