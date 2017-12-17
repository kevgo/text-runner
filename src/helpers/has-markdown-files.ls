module.exports = (glob-expression) ->
  try
    glob.sync glob-expression
        .any -> it.ends-with '.md' and fs.stat-sync(it).is-file!
  catch
    no
