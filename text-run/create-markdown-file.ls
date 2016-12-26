require! {
  'chalk' : {cyan}
  'fs'
  'path'
}


module.exports  = ({formatter, configuration, searcher}) ->
  formatter.start "creating markdown file"

  markdown = searcher.node-content type: 'fence', ({content, nodes}) ->
    | nodes.length is 0  =>  'no fenced block found'
    | !content  =>  'the block that defines markdown to run is empty'
  |> (.replace /​/g, '')

  fs.write-file-sync path.join(configuration.test-dir, '1.md'), markdown
  formatter.success!
