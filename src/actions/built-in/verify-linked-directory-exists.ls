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

  full-path = path.join path.resolve(process.cwd!, '..', directory)
  formatter.start "verifying the #{bold cyan directory} directory exists"
  try
    stats = fs.lstat-sync full-path
    if stats.is-directory!
      formatter.success!
  catch
    formatter.error "directory #{cyan bold full-path} does not exist"
