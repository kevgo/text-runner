require! {
}


# Runs the JavaScript code given in the code block
module.exports = ({formatter, searcher, configuration}) ->
  formatter.start("validating JavaScript")

  code = searcher.node-content type: 'fence', ({nodes, content}) ->
    | nodes.length is 0  =>  'no code to run found'
    | nodes.length > 1   =>  'too many code blocks found'
    | !content           =>  'no JavaScript code found in the fenced block'

  formatter.output code

  try
    new Function code
    formatter.success 'valid Javascript code'
  catch
    formatter.error "invalid Javascript: #{e.message}"
    throw new Error 1
