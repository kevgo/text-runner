require! {
  'chalk' : {cyan}
  'fs'
  'js-yaml'
  'prelude-ls' : {minimum}
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "determining minimum supported NodeJS version"

  expected-version = searcher.node-content type: 'text', ({nodes, content}) ->
    | !content         =>  'no text given'
    | +content is NaN  =>  'given Node version is not a number'
  |> parse-int
  formatter.refine "determining minimum supported NodeJS version is #{cyan expected-version}"

  get-supported-version (err, supported-version) ->
    | err                                    =>  formatter.error err
    | supported-version is expected-version  =>  formatter.success "requires at least Node #{cyan supported-version}"
    done err


function get-supported-version done
  load-yml-file '.travis.yml', (err, content) ->
    | err  =>  return done err
    if (minimum-version = content.node_js |> minimum |> parse-int) is NaN
      return done new Error "listed version is not a number"
    done null, minimum-version


function load-yml-file filename, done
  try
    done null, js-yaml.safe-load(fs.read-file-sync filename, encoding: 'utf8')
  catch
    done e
