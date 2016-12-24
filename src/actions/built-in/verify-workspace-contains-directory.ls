require! {
  chalk : {bold, cyan}
  fs
  path
}


# Verifies that the test workspace contains the given directory
module.exports = function {configuration, formatter, searcher}
  directory = searcher.node-content type: 'code', ({content, nodes}) ->
    | nodes.length is 0          =>  'no code block found'
    | nodes.length > 1           =>  'too many code blocks found'
    | content.trim!.length is 0  =>  'empty code block found'

  full-path = path.join configuration.test-dir, directory
  formatter.start "verifying the #{bold cyan directory} directory exists in the test workspace"
  try
    stats = fs.lstat-sync full-path
    if stats.is-directory!
      formatter.success!
  catch
    formatter.error "directory #{cyan bold directory} does not exist in the test workspace"
    throw new Error 1
