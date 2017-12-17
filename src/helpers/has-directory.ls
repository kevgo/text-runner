require! 'fs'

module.exports = (dirname) ->
  try
    info = fs.stat-sync dirname
    info.is-directory!
  catch
    no
