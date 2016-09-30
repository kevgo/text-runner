require! {
  'cli-cursor'
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!

cli-cursor.hide!
new TutorialRunner!.run(process.argv[2] or 'run')
