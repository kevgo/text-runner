require! {
  'chalk' : {bold, dim, green, red}
  'prelude-ls' : {compact, unique}
}


# A very robust formatter, prints output before the step name
class RobustFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @documentation-file-line = -1


  output: (text) ~>
    console.log dim text.trim!


  refine: (@activity-text) ->


  set-lines: (@start-line, @end-line) ->


  # called when we start processing a markdown file
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity
  start: (@activity-text) ->


  # called when the last started activity finished successful
  success: ->
    console.log green @_format!


  # Called on general errors
  error: (@error-message) ->
    console.log bold red @_format!
    process.exit 1


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    console.log bold green "\nSuccess! #{steps-count} steps passed"



  _format: ->
    result = ''
    if @documentation-file-path
      result += "#{@documentation-file-path}"
      if @start-line
        result += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      result += " -- "
    result += "#{@activity-text}" if @activity-text
    result += "#{@error-message}" if @error-message
    result



module.exports = RobustFormatter
