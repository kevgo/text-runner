require! {
  'prelude-ls' : {capitalize}
  'wait' : {wait}
}


module.exports  = ({filename, start-line, end-line, nodes, formatter}, done) ->
  formatter.start-activity 'greeting the world'
  wait 1000, ->
    formatter.console.log "Hello World!"
    wait 1000, ->
      formatter.activity-success!
      done!
