require! {
  'prelude-ls' : {capitalize}
}


class HelloWorldAction


  (@markdown-line, @formatter) ->


  load: (node) ->


  run: (done) ->
    @formatter.start-activity 'echoing', @markdown-line
    console.log "Hello World!"
    @formatter.activity-success!
    done!



module.exports = HelloWorldAction
