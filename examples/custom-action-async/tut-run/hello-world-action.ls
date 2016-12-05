require! {
  'wait' : {wait}
}


module.exports  = ({filename, start-line, end-line, nodes, formatter}, done) ->
  formatter.start 'greeting the world'
  wait 1, ->
    formatter.output "Hello World!"
    wait 1, ->
      formatter.success!
      done!
