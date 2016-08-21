require! {
  'prelude-ls' : {capitalize}
  'wait' : {wait}
}


module.exports  = ({formatter}) ->
  formatter.start-activity 'greeting the world'
  formatter.console.log "Hello World!"
  formatter.activity-success!
