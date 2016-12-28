require! {
  'chalk' : {bold, cyan, red}
  'fs'
  'jsdiff-console'
  'path'
  'prelude-ls' : {capitalize, filter}
}


module.exports  = ({configuration, formatter, searcher}, done) ->

  file-path = searcher.node-content types: ['strongtext', 'emphasizedtext'], ({nodes, content}) ->
    | nodes.length is 0    =>  'no file path found'
    | nodes.length > 1     =>  "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | content.length is 0  =>  'no path given for file to verify'

  expected-content = searcher.node-content types: ['fence', 'code'], ({nodes}) ->
    | nodes.length is 0  =>  'no text given to compare file content against'
    | nodes.length > 1   =>  'found multiple content blocks for file to verify, please provide only one'

  formatter.start "verifying file #{cyan file-path}"
  full-path = path.join(configuration.test-dir, file-path)
  fs.read-file full-path, 'utf8', (err, actual-content) ->
    | err?.code is 'ENOENT'  =>  formatter.error "file #{red file-path} not found" ; return done new Error 1
    | err                    =>  return done err
    jsdiff-console actual-content.trim!, expected-content.trim!, (err) ~>
      | err  =>  formatter.error "mismatching content in #{cyan bold file-path}:\n#{err.message}" ; done 1
      | _    =>  formatter.success! ; done!
