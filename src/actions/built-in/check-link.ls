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
  method = if is-external-link target
    check-external-link
  else
    check-internal-link
  method target, (err) ->
    | err  =>  formatter.error err
    | _    =>  formatter.success!
    done!


function check-external-link target, done
  request target, (err) ->
    | err  =>  done 'not found'
    | _    =>  done!


function check-internal-link target, done
  fs.stat target, done


function is-external-link target
  target.starts-with '//' or target.starts-with 'http://' or target.starts-with 'https://'
