require! {
  path
}


# Changes the current working directory to the one given in the hyperlink
module.exports = function {formatter, searcher}
  directory = searcher.node-content type: 'link_open', ({nodes}) ->
    | nodes.length is 0  =>  'no link found'
    | nodes.length > 1   =>  'too many links found'

  full-path = path.join __dirname, '..', directory
  formatter.start "changing into the '#{directory}' directory"
  formatter.output "cd #{full-path}"
  process.chdir full-path
  formatter.success!
