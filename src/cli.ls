require! {
  'cli-cursor'
  'end-child-processes'
  'minimist'
  '../package.json' : pkg
  'prelude-ls' : {filter, split, tail}
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!
cli-cursor.hide!

argv = minimist process.argv.slice(2)
commands-text = delete argv._
commands = (commands-text[0] or '') |> split ' '
                                    |> filter -> it isnt 'tut-run'
tutorial-runner = new TutorialRunner argv

tutorial-runner.execute (commands[0] or 'run'), tail(commands), (err) ->
  if err
    process.exit 1
  end-child-processes!
