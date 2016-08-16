require! {
  'liftoff' : Liftoff
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!

new Liftoff name: 'tut-run'
  ..launch {}, (env) ->
    new TutorialRunner!.run!
