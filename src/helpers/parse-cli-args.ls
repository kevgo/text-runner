require!  {
  './available-commands'
  'minimist'
  'path'
  'prelude-ls' : {filter, split, tail}
}

# Parses the command-line options received,
# and returns them structured as the command to run and options
module.exports = (argv) ->

  # remove optional node call
  if path.basename(argv[0] or '') is 'node'
    argv.splice 0, 1

  # remove optional text-run call
  if path.basename(argv[0] or '') is 'text-run'
    argv.splice 0, 1

  parsed-argv = minimist argv, boolean: 'fast'
  commands = delete parsed-argv._ or []

  # extract command
  if available-commands!.includes commands[0]
    command = commands[0]
    commands.splice 0, 1
  else
    command = 'run'

  {command, file: commands[0], options: parsed-argv}
