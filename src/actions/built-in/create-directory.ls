require! {
  'chalk' : {cyan}
  'mkdirp'
  'path'
  'prelude-ls' : {capitalize, filter, map}
}
debug = require('debug')('textrun:actions:create-directory')


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "creating directory"

  directory-name = searcher.node-content type: 'code', ({nodes, content}) ->
    | nodes.length is 0  =>  'no name given for directory to create'
    | nodes.length > 1   =>  "several names given: #{nodes |> map (.content) |> map ((a) -> cyan a) |> (.join ' and ')}"
    | !content           =>  'empty name given for directory to create'

  formatter.refine "creating directory #{cyan directory-name}"
  full-path = path.join(configuration.test-dir, directory-name)
  debug full-path
  mkdirp full-path, (err) ->
    | err  =>  formatter.error err
    | _    =>  formatter.success!
    done err
