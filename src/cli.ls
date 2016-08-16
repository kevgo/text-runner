require! {
  'liftoff' : Liftoff
  './tutorial-runner' : TutorialRunner
}

new Liftoff name: 'tut-run'
  ..launch {}, (env) ->
    new TutorialRunner!.run!
