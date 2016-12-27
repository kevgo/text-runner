require! {
  'chalk' : {cyan}
  'fs'
  'js-yaml'
  'prelude-ls' : {minimum}
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "determining minimum supported NodeJS version"

  documented-version = searcher.node-content type: 'text', ({nodes, content}) ->
    | !content         =>  'no text given'
    | +content is NaN  =>  'given Node version is not a number'
  |> parse-int
  formatter.refine "determining whether minimum supported NodeJS version is #{cyan documented-version}"

  get-supported-version (err, supported-version) ->
    | err                                        =>  formatter.error err ; return done err
    | supported-version is documented-version    =>  formatter.success "requires at least Node #{cyan supported-version}" ; return done!
    | supported-version isnt documented-version  =>  formatter.error "documented minimum Node version is #{cyan documented-version}, should be #{cyan supported-version}" ; return done 1


function get-supported-version done
  load-yml-file '.travis.yml', (err, content) ->
    | err  =>  return done err
    if (minimum-version = content.node_js |> minimum |> parse-int) is NaN
      return done new Error "listed version is not a number"
    done null, minimum-version


function load-yml-file filename, done
  fs.read-file filename, encoding: 'utf8', (err, file-content) ->
    | err  =>  done err
    try
      done null, js-yaml.safe-load(file-content)
    catch
      done e
