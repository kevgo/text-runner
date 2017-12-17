require!  {
  './available-commands'
  'minimist'
  'path'
  'prelude-ls' : {filter, split, tail}
}

# Parses the command-line options received,
# and returns them structured as the command to run and options
module.exports = (argv) ->

  # remove optional unix node call
  if path.basename(argv[0] or '') is 'node'
    argv.splice 0, 1

  # remove optional windows node call
  if path.win32.basename(argv[0] or '') is 'node.exe'
    argv.splice 0, 1

  # remove optional linux text-run call
  if path.basename(argv[0] or '') is 'text-run'
    argv.splice 0, 1

  # remove optional Windows CLI call
  if (argv[0] or '').ends-with 'dist\\cli'
    argv.splice 0, 1

  result = minimist argv, boolean: 'fast'
  commands = delete result._ or []

  # extract command
  if available-commands!.includes commands[0]
    command = commands[0]
    commands.splice 0, 1
  else
    command = 'run'

  result.command = command
  result.file = commands[0]
  result
