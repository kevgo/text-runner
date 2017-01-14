require! {
  'chalk' : {cyan, green, red}
  'path'
  'prelude-ls' : {any, keys}
  '../../helpers/trim-dollar'
}


module.exports  = ({configuration, formatter, searcher}, done) ->
  formatter.start "verifying exported global command"

  command-name = searcher.node-content types: ['fence', 'code'], ({nodes}) ->
    | nodes.length is 0  =>  'missing code block'
    | nodes.length > 1   =>  'found multiple code blocks'
  |> trim-dollar
  |> (.trim!)

  pkg = require path.join(process.cwd!, 'package.json')
  formatter.refine "looking for an exported #{cyan command-name} command"

  if !has-command-name command-name, pkg.bin
    formatter.error "#{cyan 'package.json'} does not export a #{red command-name} command"
    return done 1
  formatter.success "provides a global #{green command-name} command"
  done!


function has-command-name command-name, exported-commands
  exported-commands  |>  keys
                     |>  any -> it is command-name
