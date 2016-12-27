require! {
  chalk : {bold, cyan}
  fs
  path
}


# Verifies that the test workspace contains the given directory
module.exports = function {configuration, formatter, searcher}, done
  directory = searcher.node-content type: 'code', ({content, nodes}) ->
    | nodes.length is 0          =>  'no code block found'
    | nodes.length > 1           =>  'too many code blocks found'
    | content.trim!.length is 0  =>  'empty code block found'

  full-path = path.join configuration.test-dir, directory
  formatter.start "verifying the #{bold cyan directory} directory exists in the test workspace"
  fs.lstat full-path, (err, stats) ->
    | err                  =>  formatter.error "directory #{cyan bold directory} does not exist in the test workspace" ; done new Error 1
    | stats.is-directory!  =>  formatter.success! ; done!
