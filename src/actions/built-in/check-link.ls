require! {
  'chalk' : {cyan}
  'fs'
  'mkdirp'
  'path'
  'prelude-ls' : {capitalize, filter, map}
  'request'
}


module.exports  = ({configuration, formatter, nodes}, done) ->
  node = nodes[0]
  target = node.content
  formatter.start "checking link to #{cyan node.content}"
  if is-external-link target
    check-external-link target, formatter, done
  else
    check-internal-link target, formatter, done


function check-external-link target, formatter, done
  request target, (err) ->
    | err  =>  formatter.warning "external website #{cyan target} not found"
    | _    =>  formatter.success!
    done!


function check-internal-link target, formatter, done
  fs.stat target, (err) ->
    | err  =>  formatter.error "link points to non-existing #{cyan target}"
    | _    =>  formatter.success!
    done!


function is-external-link target
  target.starts-with '//' or target.starts-with 'http://' or target.starts-with 'https://'
