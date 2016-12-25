require! {
  'chalk' : {bold, dim, green, magenta, red}
  './formatter' : Formatter
  'prelude-ls' : {compact, unique}
}


# A very robust formatter, prints output before the step name
class RobustFormatter extends Formatter

  # Called on general errors
  error: (@error-message) ->
    @_print-activity-header bold . red


  output: (text) ~>
    console.log dim text.trim!


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_print-activity-header green


  warning: (@warning-message) ->
    super ...
    @activity-text = ''
    @_print-activity-header bold . magenta



  _print-activity-header: (color) ->
    text = ''
    if @file-path
      text += @file-path
      if @start-line
        text += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      text += ' -- '
    text += @activity-text if @activity-text
    text += @warning-message if @warning-message
    text += "\n#{@error-message}" if @error-message
    console.log color text



module.exports = RobustFormatter
