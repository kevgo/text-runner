require! {
  'cli-cursor'
  'end-child-processes'
  'minimist'
  '../package.json' : pkg
  'prelude-ls' : {filter, split, tail}
  './text-runner' : TextRunner
  'update-notifier'
}

update-notifier({pkg}).notify!
cli-cursor.hide!

argv = minimist process.argv.slice(2)
commands-text = delete argv._
commands = (commands-text[0] or '') |> split ' '
                                    |> filter -> it isnt 'text-run'
text-runner = new TextRunner argv
text-runner.execute (commands[0] or 'run'), tail(commands), (err) ->
  end-child-processes!
  if err
    process.exit 1
