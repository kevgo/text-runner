require! {
  'chalk' : {cyan, green, red}
  'fs'
  'mkdirp'
  'path'
  'prelude-ls' : {capitalize, filter, map}
  'request'
}


module.exports  = ({filename, formatter, nodes, link-targets}, done) ->
  node = nodes[0]
  target = node.content
  formatter.start "checking link to #{cyan target}"
  switch
  | is-link-to-anchor-in-same-file target   =>  check-link-to-anchor-in-same-file filename, target, link-targets, formatter, done
  | is-link-to-anchor-in-other-file target  =>  check-link-to-anchor-in-other-file filename, target, link-targets, formatter, done
  | is-external-link target                 =>  check-external-link target, formatter, done
  | otherwise                               =>  check-internal-link target, formatter, done


function check-external-link target, formatter, done
  request target, (err) ->
    | err  =>  formatter.warning "link to non-existing external website #{cyan target}"
    | _    =>  formatter.success "link to external website #{cyan target}"
    done!


function check-internal-link target, formatter, done
  fs.stat target, (err, stats) ->
    | err                  =>  formatter.error "link to non-existing local file #{cyan target}"
    | stats.is-directory!  =>  formatter.success "link to local directory #{cyan target}"
    | _                    =>  formatter.success "link to local file #{cyan target}"
    done!


function check-link-to-anchor-in-same-file filename, target, link-targets, formatter, done
  if link-targets[filename].index-of(target.substr 1) > -1
    formatter.success "link to #{cyan filename}#{green target}"
  else
    formatter.error "link to non-existing #{cyan filename}#{red target}"


function check-link-to-anchor-in-other-file filename, target, link-targets, formatter, done
  [target-filename, target-anchor] = target.split '#'
  if link-targets[target-filename].index-of(target-anchor) > -1
    formatter.success "link to #{cyan target-filename}##{green target-anchor}"
  else
    formatter.error "link to non-existing #{cyan target-filename}#{red target-anchor}"


function is-external-link target
  target.starts-with '//' or target.starts-with 'http://' or target.starts-with 'https://'


function is-link-to-anchor-in-other-file target
  switch
  | (target.match /#/g or []).length isnt 1  =>  no
  | /^https?:\/\//.test target               =>  no
  | otherwise                                =>  yes


function is-link-to-anchor-in-same-file target
  target.starts-with '#'
