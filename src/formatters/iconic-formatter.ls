require! {
  'chalk' : {bold, dim, green, magenta, red, yellow}
  'figures'
  'indent-string'
  'log-update'
  'prelude-ls' : {compact, unique}
  'strip-ansi'
}


# The standard formatter, uses green, yellow, and red icons
class IconicFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @start-line = null
    @end-line = null

    # the console output created by the current activity
    @console = ''

    # Note: I have to define these attributes here,
    #       since doing so at the class level
    #       binds them to the class scope for some reason
    @stdout =
      write: @output

    @stderr =
      write: @output

    @console =
      log: (text) ~>
        @output "#{text}\n"



  # called when we start processing a markdown file
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity that was defined in a block
  start: (@activity-text) ->
    @_print-header yellow(figures.pointer), yes
    @console = ''
    @error-message = ''
    @warning-message = ''


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_print-header green figures.tick
    log-update.done!


  # Called on general errors
  error: (@error-message) ->
    @_print-header-and-console red figures.cross
    process.exit 1


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @_print-header yellow(figures.pointer), yes


  set-lines: (@start-line, @end-line) ->


  # Called on general warnings
  warning: (@warning-message) ->
    @_print-header-and-console magenta figures.warning
    log-update.done!


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update bold green "\nSuccess! #{steps-count} steps passed"


  _activity-header: (figure, newline) ->
    result = "#{figure} "
    if @documentation-file-path
      result += "#{@documentation-file-path}"
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


  output: (text) ~>
    @console += dim strip-ansi text



module.exports = IconicFormatter
