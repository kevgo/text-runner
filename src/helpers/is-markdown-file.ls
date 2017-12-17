require! {
  'fs'
  'path'
  'process'
}

module.exports = (filename) ->
  try
    filepath = path.join(process.cwd(), filename)
    console.log filepath
    filename.ends-with '.md' and fs.stat-sync(filepath).is-file!
  catch
    no
