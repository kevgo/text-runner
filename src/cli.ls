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
new TutorialRunner({formatter: argv.format}).execute command, (err) ->
  if err
    new HelpCommand({err}).run!
    process.exit 1
