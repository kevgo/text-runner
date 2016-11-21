require! {
  'wait' : {wait, wait-until}
}


# Runs the JavaScript code given in the code block
module.exports = ({formatter, searcher, configuration}, done) ->
  formatter.start("running JavaScript code")

  code = searcher.node-content type: 'fence', ({nodes}) ->
    | nodes.length is 0  =>  'no code to run found'
    | nodes.length > 1   =>  'too many code blocks found'
  |> replace-substitutions-in-configuration _, configuration
  |> replace-require-local-module
  |> replace-variable-declarations

  __finished = (err) ->
    | err  =>  formatter.error err
    | _    =>  formatter.success!
    done err, 1

  code = if has-callback code
    replace-async-callbacks code
  else
    append-async-callback code
  formatter.output code
  eval code


function append-async-callback code
  """
  #{code.trim!};
  __finished()
  """


function replace-async-callbacks code
  code.replace '<CALLBACK>', '__finished'
      .replace /\/\/\s*\.\.\./g, '__finished()'


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
