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
  formatter.start "checking link to #{cyan node.content}"
  switch
  | is-external-link target   =>  check-external-link target, formatter, done
  | is-link-to-anchor target  =>  check-link-to-anchor filename, target, link-targets, formatter, done
  | otherwise                 =>  check-internal-link target, formatter, done


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


function check-link-to-anchor filename, target, link-targets, formatter, done
  if link-targets[filename].index-of(target.substr 1) > -1
    formatter.success "link to #{cyan filename}#{green target}"
  else
    formatter.error "link to non-existing #{cyan filename}#{red target}"


function is-external-link target
  target.starts-with '//' or target.starts-with 'http://' or target.starts-with 'https://'


function is-link-to-anchor target
  target.starts-with '#'
