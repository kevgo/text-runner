require! {
  'chalk' : {bold, cyan}
  'fs'
  'jsdiff-console'
  'path'
  'prelude-ls' : {capitalize, filter}
}


module.exports  = ({configuration, formatter, searcher}, done) ->

  file-path = searcher.node-content type: 'strongtext', ({nodes, content}) ->
    | nodes.length is 0    =>  'no file path found'
    | nodes.length > 1     =>  "multiple file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | content.length is 0  =>  'no path given for file to verify'

  expected-content = searcher.node-content types: ['fence', 'code'], ({nodes}) ->
    | nodes.length is 0  =>  'no text given to compare file content against'
    | nodes.length > 1   =>  'found multiple content blocks for file to verify, please provide only one'

  formatter.start "verifying file #{cyan file-path}"
  try
    actual-content = fs.read-file-sync path.join(configuration.test-dir, file-path), 'utf8'
  catch
    if e.code is 'ENOENT'
      error = "file #{cyan file-path} not found"
      formatter.error error
      return done error
    else throw e
  jsdiff-console actual-content.trim!, expected-content.trim!, (err) ~>
    if err
      formatter.error "mismatching content in #{cyan bold file-path}:\n#{err.message}"
      done 1
    else
      formatter.success!
      done!
