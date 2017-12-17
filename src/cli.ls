require! {
  'chalk' : {red}
  'cli-cursor'
  'end-child-processes'
  '../package.json' : pkg
  './helpers/parse-cli-args'
  './text-runner' : TextRunner
  'update-notifier'
}

update-notifier({pkg}).notify!
cli-cursor.hide!

{command, file, options} = parse-cli-args process.argv
text-runner = new TextRunner options
text-runner.execute command, file, (err) ->
  | err and err.message isnt 1  =>  console.log red err

  end-child-processes!
  process.exit if err then 1 else 0
