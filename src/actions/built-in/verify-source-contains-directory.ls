require! {
  chalk : {bold, cyan}
  fs
  path
}


# Verifies that a local directory linked in MarkDown exists
module.exports = function {formatter, searcher}
  directory = searcher.node-content type: 'link_open', ({nodes}) ->
    | nodes.length is 0  =>  'no link found'
    | nodes.length > 1   =>  'too many links found'

  formatter.start "verifying the #{bold cyan directory} directory exists in the source code"
  try
    full-path = path.resolve directory
    stats = fs.lstat-sync full-path
    if stats.is-directory!
      formatter.success!
  catch
    formatter.error "directory #{cyan bold directory} does not exist in the source code"
    throw new Error 1
