require! {
  'chalk' : {bold, cyan}
  'eol'
  'fs'
  'jsdiff-console'
  'path'
  'prelude-ls' : {capitalize, filter}
}


module.exports  = ({configuration, formatter, searcher}, done) ->

  file-name = searcher.node-content type: 'strongtext', ({nodes, content}) ->
    | nodes.length is 0    =>  'no file path found'
    | nodes.length > 1     =>  "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | content.length is 0  =>  'no path given for file to verify'

  base-dir = searcher.node-content type: 'link_open', ({nodes, content}) ->
    | nodes.length > 1           =>  'too many links found'
    | content.trim!.length is 0  =>  'empty link found'
  base-dir or= '.'

  expected-content = searcher.node-content type: 'fence', ({nodes}) ->
    | nodes.length is 0  =>  'no text given to compare file content against'
    | nodes.length > 1   =>  'found multiple content blocks for file to verify, please provide only one'

  formatter.start "verifying document content matches source code file #{cyan file-name}"
  file-path = path.join __dirname, '..' '..' '..' base-dir, file-name
  fs.read-file file-path, 'utf8', (err, actual-content) ->
    | err and err.code is 'ENOENT'  =>  formatter.error "file #{cyan file-path} not found" ; return done new Error 1
    | err                           =>  return done err

    jsdiff-console (actual-content |> (.trim!) |> eol.lf), (expected-content |> (.trim!) |> eol.lf), (err) ~>
      | err  =>  formatter.error "mismatching content in #{cyan bold file-path}:\n#{err.message}"; done 1
      | _    =>  formatter.success! ; done!
