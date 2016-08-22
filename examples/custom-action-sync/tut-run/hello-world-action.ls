require! {
  'prelude-ls' : {capitalize}
  'wait' : {wait}
}


module.exports  = ({formatter}) ->
  formatter.start 'greeting the world'
  formatter.console.log "Hello World!"
  formatter.success!
