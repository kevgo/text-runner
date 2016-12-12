require! {
  'chalk' : {cyan, green, magenta, red}
  'fs'
  'request'
}


# Checks for broken hyperlinks
module.exports  = ({formatter, nodes, link-targets}, done) ->
  node = nodes[0]
  formatter.start "checking image #{cyan node.src}"
  switch
  | is-image-without-src node  =>  formatter.error "image tag without source" ; done 1
  | is-remote-image node       =>  check-remote-image node, formatter, done
  | otherwise                  =>  check-local-image node, formatter, done


function check-local-image node, formatter, done
  fs.stat node.src, (err, stats) ->
    | err  =>  formatter.error "image #{red node.src} does not exist" ; done 1
    | _    =>  formatter.success "image #{cyan node.src} exists"; done!


function check-remote-image node, formatter, done
  request url: node.src, timeout: 2000, (err, response) ->
    | err?.message is 'ESOCKETTIMEDOUT'  =>  formatter.warning "image #{magenta node.src} timed out"; done!
    | err                                =>  done err
    | response.status-code is 404        =>  formatter.warning "image #{magenta node.src} does not exist"; done!
    | otherwise                          =>  formatter.success "image #{green node.src} exists"; done!


function is-remote-image node
  node.src.starts-with '//' or node.src.starts-with 'http://' or node.src.starts-with 'https://'


function is-image-without-src node
  !node.src
