require! {
  'chalk' : {bold, dim, green, magenta, red, yellow}
  'figures'
  './formatter' : Formatter
  'log-update'
  'prelude-ls' : {compact, unique}
  'strip-ansi'
}


# The standard formatter, uses green, yellow, and red icons
class IconicFormatter extends Formatter


  # Called on general errors
  error: (@error-message) ->
    @_print-header-and-console red figures.cross
    process.exit 1


  output: (text) ~>
    @console += dim strip-ansi text


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @_print-header yellow(figures.pointer), yes


  # Called when we start performing an activity that was defined in a block
  start: (@activity-text) ->
    super ...
    @_print-header yellow(figures.pointer), yes


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_print-header green figures.tick
    log-update.done!


  # Called on general warnings
  warning: (@warning-message) ->
    super!
    @_print-header-and-console magenta figures.warning
    log-update.done!



  # Returns the activity header to be printed
  _activity-header: (figure, newline) ->
    result = "#{figure} "
    if @file-path
      result += "#{@file-path}"
      if @start-line
        result += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      result += " -- "
    if @error-message
      result += bold(@error-message)
    else if @warning-message
      result += bold(@warning-message)
    else
      result += bold(@activity-text) if @activity-text
    result += "\n" if newline
    result


  _print-header: (figure, newline) ->
    log-update @_activity-header figure, newline


  _print-header-and-console: (figure, newline) ->
    log-update @_activity-header(figure, newline) + @console



module.exports = IconicFormatter
