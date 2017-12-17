require! 'path'

module.exports = (command) ->
  path.join __dirname, '..' 'commands', command, "#{command}-command.js"
