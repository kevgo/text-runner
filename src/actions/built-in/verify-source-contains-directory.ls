require! {
  chalk : {bold, cyan}
  fs
  path
}


# Verifies that a local directory linked in MarkDown exists
module.exports = function {formatter, searcher}, done
  directory = searcher.node-content type: 'link_open', ({nodes}) ->
    | nodes.length is 0  =>  'no link found'
    | nodes.length > 1   =>  'too many links found'

  formatter.start "verifying the #{bold cyan directory} directory exists in the source code"
  fs.lstat path.join(process.cwd!, directory), (err, stats) ->
    | err                  =>  formatter.error "directory #{cyan bold directory} does not exist in the source code" ; done new Error 1
    | stats.is-directory!  =>  formatter.success "directory #{cyan bold directory} exists in the source code" ; done!
    | otherwise            =>  formatter.error "#{cyan bold directory} exists in the source code but is not a directory" ; done new Error 1
