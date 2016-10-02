require! {
  'chalk' : {bold, dim, red}
  'cli-cursor'
  '../package.json' : pkg
  './tutorial-runner' : TutorialRunner
  'update-notifier'
}

update-notifier({pkg}).notify!

cli-cursor.hide!
command = process.argv[2] or 'run'
new TutorialRunner!.execute command, (err) ->
  if err
    help err


function help err
  console.log """
    #{dim "Tutorial Runner #{pkg.version}"}

    #{red bold "Error: #{err}"}


    USAGE: #{bold 'tut-run <command>'}

    COMMANDS:
    - #{bold 'run'}     runs the tutorial
    - #{bold 'setup'}   creates an example configuration file
    - #{bold 'help'}    shows this help screen

    """
