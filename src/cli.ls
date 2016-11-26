require! {
  'cli-cursor'
  './commands/help/help-command' : HelpCommand
  'end-child-processes'
  'minimist'
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!
cli-cursor.hide!

argv = minimist process.argv.slice(2)
commands = delete argv._
tutorial-runner = new TutorialRunner argv

tutorial-runner.execute (commands[0] or 'run'), (err) ->
  if err
    new HelpCommand({err}).run!
    process.exit 1
  end-child-processes!
