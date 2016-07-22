require! {
  'chalk' : {bold, green, red}
}


# The standard formatter
class StandardFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @documentation-file-line = -1



  # called when we start processing a markdown file
  start-documentation-file: (@documentation-file-path) ->


  # called when we are done processing a markdown file
  done-with-documentation-file: ->


  # Called when we start processing an active block in a markdown file
  start-block: (@documentation-file-line) ->


  # Called when we ran into an error parsing a block in a markdown file
  parse-block-error: (message, line) ->
    console.log red "#{bold @documentation-file-path}:#{bold line} -- Error: #{message}"
    process.exit 1


  done-with-block: ->
    @documentation-file-line = null


  # Called when we start performing an activity that was defined in a block
  start-activity: (text) ->
    console.log "#{bold @documentation-file-path}:#{bold @documentation-file-line} -- #{text}"

  # called when the last started activity finished successful
  activity-success: ->


  # called when the last started activity failed
  activity-error: (message) ->
    console.log red "#{bold @documentation-file-path}:#{bold @documentation-file-line} -- Error: #{message}"
    process.exit 1


  error: (message) ->
    console.log red "Error: #{message}"
    process.exit 1


  # called when the whole test suite passed
  suite-passes: (steps-count) ->
    console.log green "\nSuccess! #{steps-count} steps passed"




  # indents the given text by the given number of spaces
  indent-text: (text, count) ->
    text.replace /^/gm, ' '*count



module.exports = StandardFormatter
