module.exports = (command) ->
  | process.platform is 'win32'  =>  ['cmd' '/c' command.replace(/\//g, '\\')]
  | otherwise                    =>  ['bash', '-c' command]
