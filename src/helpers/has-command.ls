require! {
  'fs'
  './command-path'
}

module.exports = (command) ->
  try
    fs.stat-sync command-path command
    yes
  catch
    no
