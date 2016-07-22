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
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity that was defined in a block
  start-activity: (text, @documentation-file-line) ->
    console.log "#{bold @documentation-file-path}:#{bold @documentation-file-line} -- #{text}"


  # called when the last started activity finished successful
  activity-success: ->


  # called when the last started activity failed
  activity-error: (message) ->
    console.log red "#{bold @documentation-file-path}:#{bold @documentation-file-line} -- Error: #{message}"
    process.exit 1


  # Called on general errors
  error: (message, line = @documentation-file-line) ->
    text = ''
    if @documentation-file-path
      text += "#{bold @documentation-file-path}"
    if line > -1
      text += ":#{bold line}"
    if text.length > 0
      text += ' -- '
    text += "Error: #{message}"
    console.log red text
    process.exit 1


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    console.log green "\nSuccess! #{steps-count} steps passed"



module.exports = StandardFormatter
