require! {
  'chalk' : {cyan}
  'fs'
  'path'
  'prelude-ls' : {capitalize, filter, map}
}


module.exports  = ({formatter, searcher}, done) ->
  formatter.start-activity "creating file"

  file-path = searcher.node-content type: 'text', ({nodes, content}) ->
    | nodes.length is 0  =>  'no path given for file to create'
    | nodes.length > 1   =>  "several file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | !content           =>  'no path given for file to create'

  content = searcher.node-content type: 'fence', ({nodes, content}) ->
    | nodes.length is 0  =>  'no content given for file to create'
    | nodes.length > 1   =>  'found multiple content blocks for file to create, please provide only one'
    | !content           =>  'no content given for file to create'

  formatter.refine-activity "creating file #{cyan file-path}"
  fs.write-file path.join(global.working-dir, file-path), content, (err) ~>
    | err  =>  formatter.activity-error!
    formatter.activity-success!
    done null, 1
