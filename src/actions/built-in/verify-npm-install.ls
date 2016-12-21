require! {
  'chalk' : {cyan, green}
  'path'
  'prelude-ls' : {empty, filter, map}
  '../../helpers/trim-dollar'
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "verifying NPM installation instructions"

  install-text = searcher.node-content type: ['fence', 'code'], ({nodes}) ->
    | nodes.length is 0  =>  'missing code block'
    | nodes.length > 1   =>  'found multiple code blocks'
  |> trim-dollar

  pkg = require path.join(process.cwd!, 'package.json')
  formatter.start "verifying NPM installs #{cyan pkg.name}"

  if misses-package-name install-text, pkg.name
    formatter.error!
    return done 1
  formatter.success "installs #{green pkg.name}"
  done!


function misses-package-name install-text, package-name
  install-text |> (.split ' ')
               |> map (.trim!)
               |> filter (is package-name)
               |> empty
