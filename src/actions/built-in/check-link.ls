require! {
  'chalk' : {cyan, magenta, red}
  'fs'
  'mkdirp'
  'path'
  'prelude-ls' : {capitalize, filter, first, map}
  'request'
}


# Checks for broken hyperlinks
module.exports  = ({filename, formatter, nodes, link-targets}, done) ->
  target = nodes[0].content
  formatter.start "checking link to #{cyan target}"
  switch
  | is-link-without-target target           =>  formatter.error "link without target" ; return done 1
  | is-link-to-anchor-in-same-file target   =>  check-link-to-anchor-in-same-file filename, target, link-targets, formatter, done
  | is-link-to-anchor-in-other-file target  =>  check-link-to-anchor-in-other-file filename, target, link-targets, formatter, done
  | is-external-link target                 =>  check-external-link target, formatter, done
  | otherwise                               =>  check-link-to-filesystem filename, target, formatter, done


function check-external-link target, formatter, done
  request url: target, timeout: 2000, (err, response) ->
    | err?.code is 'ENOTFOUND'            =>  formatter.warning "link to non-existing external website #{red target}"; done!
    | response?.status-code is 404        =>  formatter.warning "link to non-existing external website #{red target}"; done!
    | err?.message is 'ESOCKETTIMEDOUT'   =>  formatter.warning "link to #{magenta target} timed out"; done!
    | err                                 =>  done err
    | otherwise                           =>  formatter.success "link to external website #{cyan target}"; done!


function check-link-to-filesystem filename, target, formatter, done
  target = path.join path.dirname(filename), target
  fs.stat target, (err, stats) ->
    | err                  =>  formatter.error "link to non-existing local file #{red target}"
    | stats.is-directory!  =>  formatter.success "link to local directory #{cyan target}"
    | _                    =>  formatter.success "link to local file #{cyan target}"
    done err


function check-link-to-anchor-in-same-file filename, target, link-targets, formatter, done
  target-entry = link-targets[filename] |> filter (.name is target.substr 1) |> first
  if !target-entry
    formatter.error "link to non-existing local anchor #{red target}"
    return done 1
  if target-entry.type is 'heading'
    formatter.success "link to local heading #{cyan target-entry.text}"
  else
    formatter.success "link to #{cyan "##{target-entry.name}"}"
  done!


function check-link-to-anchor-in-other-file filename, target, link-targets, formatter, done
  [target-filename, target-anchor] = target.split '#'
  target-filename = decodeURI target-filename
  if !link-targets[target-filename]
    formatter.error "link to anchor ##{cyan target-anchor} in non-existing file #{red target-filename}"

  target-entry = (link-targets[target-filename] or []) |> filter (.name is target-anchor) |> first
  if !target-entry
    formatter.error "link to non-existing anchor ##{red target-anchor} in #{cyan target-filename}"

  if target-entry.type is 'heading'
    formatter.success "link to heading #{cyan target-entry.text} in #{cyan target-filename}"
  else
    formatter.success "link to #{cyan target-filename}##{cyan target-anchor}"
  done!


function is-external-link target
  target.starts-with '//' or target.starts-with 'http://' or target.starts-with 'https://'


function is-link-to-anchor-in-other-file target
  switch
  | (target.match /#/g or []).length isnt 1  =>  no
  | /^https?:\/\//.test target               =>  no
  | otherwise                                =>  yes


function is-link-to-anchor-in-same-file target
  target.starts-with '#'


function is-link-without-target target
  !target
