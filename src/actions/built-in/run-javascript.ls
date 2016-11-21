require! {
  'wait' : {wait, wait-until}
}

finished-method = (formatter, code, cb) ->
  formatter.success!
  cb null, 1


# Runs the JavaScript code given in the code block
module.exports = ({formatter, searcher, configuration}, done) ->
  formatter.start("running JavaScript code")

  code = searcher.node-content type: 'fence', ({nodes}) ->
    | nodes.length is 0  =>  'no code to run found'
    | nodes.length > 1   =>  'too many code blocks found'
  |> replace-substitutions-in-configuration _, configuration
  |> replace-require-local-module
  |> replace-variable-declarations

  finished = finished-method.bind(null, formatter, code, done)
  if has-callback code
    # the code is asynchronous
    code = code.replace '<CALLBACK>', 'finished'
    code = code.replace '// ...', 'finished()'
    formatter.output code
    eval code
  else
    # the code is synchronous
    formatter.output code
    eval code
    formatter.success!
    done null, 1


function replace-substitutions-in-configuration code, configuration
  for search, replace of configuration?.file-data?.actions?.run-javascript?.replace
    code .= replace search, replace
  code


function replace-require-local-module code
  code.replace /require\(['"].['"]\)/, 'require(process.cwd())'


function replace-variable-declarations code
  code.replace /\bconst /g, 'global.'
      .replace /\bvar /g, 'global.'
      .replace /\bthis\./g, 'global.'


function has-callback code
  (code.index-of('<CALLBACK>') > -1) or (code.index-of('// ...') > -1)
