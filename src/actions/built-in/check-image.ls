require! {
  'chalk' : {cyan, magenta, red}
  'fs'
  'path'
  'request'
}


# Checks for broken hyperlinks
module.exports  = ({filename, formatter, nodes, link-targets}, done) ->
  node = nodes[0]
  image-path = path.join path.dirname(filename), node.src
  formatter.start "checking image #{cyan image-path}"
  switch
  | is-image-without-src node  =>  formatter.error "image tag without source" ; done 1
  | is-remote-image node       =>  check-remote-image node, formatter, done
  | otherwise                  =>  check-local-image image-path, formatter, done


function check-local-image image-path, formatter, done
  fs.stat path.join(process.cwd!, image-path), (err, stats) ->
    | err  =>  formatter.error "image #{red image-path} does not exist" ; done 1
    | _    =>  formatter.success "image #{cyan image-path} exists"; done!


function check-remote-image node, formatter, done
  request url: node.src, timeout: 2000, (err, response) ->
    | err?.code is 'ENOTFOUND'            =>  formatter.warning "image #{magenta node.src} does not exist"; done!
    | response?.status-code is 404        =>  formatter.warning "image #{magenta node.src} does not exist"; done!
    | err?.message is 'ESOCKETTIMEDOUT'   =>  formatter.warning "image #{magenta node.src} timed out"; done!
    | err                                 =>  done err
    | otherwise                           =>  formatter.success "image #{cyan node.src} exists"; done!


function is-remote-image node
  node.src.starts-with '//' or node.src.starts-with 'http://' or node.src.starts-with 'https://'


function is-image-without-src node
  !node.src
