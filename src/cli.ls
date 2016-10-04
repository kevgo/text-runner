require! {
  'cli-cursor'
  './commands/help/help-command' : HelpCommand
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!

cli-cursor.hide!
command = process.argv[2] or 'run'
new TutorialRunner!.execute command, (err) ->
  if err
    new HelpCommand({err}).run!
