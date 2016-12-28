require! {
  chalk : {bold, cyan}
  path
}


# Changes the current working directory to the one given in the hyperlink or code block
module.exports = function {configuration, formatter, searcher}
  formatter.start "changing the current working directory"
  directory = searcher.node-content types: ['link_open', 'code'], ({nodes, content}) ->
    | nodes.length is 0          =>  'no link found'
    | nodes.length > 1           =>  'too many links found'
    | content.trim!.length is 0  =>  'empty link found'

  formatter.refine "changing into the #{bold cyan directory} directory"
  formatter.output "cd #{directory}"
  try
    process.chdir path.join(configuration.test-dir, directory)
  catch
    switch
    | e.code is 'ENOENT' =>  formatter.error "directory #{directory} not found"
    | otherwise          =>  formatter.error e.message
    throw e
  formatter.success!
