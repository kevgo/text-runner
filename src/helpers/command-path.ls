require! 'path'

module.exports = (command) ->
  path.join __dirname, '..' '..' 'dist' 'commands', command, "#{command}-command.js"
