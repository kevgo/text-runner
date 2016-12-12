require! {
  'chalk' : {bold, dim, green, magenta, red, yellow}
  'figures'
  './formatter' : Formatter
  'indent-string'
  'log-update'
  'prelude-ls' : {compact, unique}
  'strip-ansi'
}


# The standard formatter, uses green, yellow, and red icons
class ColoredFormatter extends Formatter


  # Called on general errors
  error: (@error-message) ->
    @_print-header red


  output: (text) ~>
    @console += dim strip-ansi text


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @_print-header yellow, yes


  # Called when we start performing an activity that was defined in a block
  start: (@activity-text) ->
    super ...
    @_print-header yellow, yes


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_print-header green
    log-update.done!


  # Called on general warnings
  warning: (@warning-message) ->
    super!
    @_print-header-and-console magenta
    log-update.done!



  _activity-header: (color, newline) ->
    result = ""
    if @file-path
      result += color "#{@file-path}"
      if @start-line
        result += color ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      result += color " -- "
    result += color @activity-text if @activity-text
    result += color @warning-message if @warning-message
    result += "\n#{red @error-message}" if @error-message
    result += "\n" if newline
    result


  _print-header: (figure, newline) ->
    log-update @_activity-header figure, newline


  _print-header-and-console: (figure, newline) ->
    log-update @_activity-header(figure, newline) + @console



module.exports = ColoredFormatter
