require! {
  'chalk' : {cyan}
  'fs'
  'mkdirp'
  'path'
  'prelude-ls' : {capitalize, filter, map}
}
debug = require('debug')('textrun:actions:cd')


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "creating file"

  file-path = searcher.node-content types: ['emphasizedtext', 'strongtext'], ({nodes, content}) ->
    | nodes.length is 0  =>  'no path given for file to create'
    | nodes.length > 1   =>  "several file paths found: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | !content           =>  'no path given for file to create'

  content = searcher.node-content types: ['fence', 'code'], ({nodes, content}) ->
    | nodes.length is 0  =>  'no content given for file to create'
    | nodes.length > 1   =>  'found multiple content blocks for file to create, please provide only one'
    | !content           =>  'no content given for file to create'

  formatter.refine "creating file #{cyan file-path}"
  full-path = path.join(configuration.test-dir, file-path)
  debug full-path
  mkdirp path.dirname(full-path), (err) ->
    | err  =>  return done err
    fs.write-file full-path, content, (err) ~>
      | err  =>  formatter.error err ; done new Error 1
      | _    =>  formatter.success! ; done!
