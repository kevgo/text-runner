require! {
  'prelude-ls' : {capitalize}
  'wait' : {wait}
}


module.exports  = ({formatter}) ->
  formatter.start 'greeting the world'
  formatter.output "Hello World!"
  formatter.success!
