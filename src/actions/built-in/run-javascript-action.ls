require! {
  'wait' : {wait, wait-until}
}

finished-method = (formatter, code, cb) ->
  formatter.success!
  cb null, 1


# Runs the JavaScript code given in the code block
module.exports = ({formatter, searcher}, done) ->
  code = searcher.node-content type: 'fence', ({nodes}) ->
    | nodes.length is 0  =>  'no code to run found'
    | nodes.length > 1   =>  'too many code blocks found'

  formatter.start("running JavaScript code")
  formatter.output code

  # make sure the code requires this library and not the published version
  if (matches = /require\(['"]exocom-mock['"]\)/.exec code)
    code = code.replace matches[0], "require('..')"

  # allow different JS blocks to share the "this" object
  code = code.replace /\bthis\./g, 'global.'
  code = code.replace /\bconst /g, 'global.'
  code = code.replace /\bvar /g, 'global.'

  finished = finished-method.bind(null, formatter, code, done)
  # eval "wait(100, finished)"
  # return
  if has-callback code
    # the code is asynchronous
    code = code.replace '<CALLBACK>', 'finished'
    code = code.replace '// ...', 'finished()'
    eval code
  else
    # the code is synchronous
    eval code
    formatter.success!
    done null, 1


function has-callback code
  (code.index-of('<CALLBACK>') > -1) or (code.index-of('// ...') > -1)
