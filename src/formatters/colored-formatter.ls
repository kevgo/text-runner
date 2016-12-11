require! {
  'chalk' : {bold, dim, green, magenta, red, yellow}
  'figures'
  'indent-string'
  'log-update'
  'prelude-ls' : {compact, unique}
  'strip-ansi'
}


# The standard formatter, uses green, yellow, and red icons
class ColoredFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @start-line = null
    @end-line = null

    # the console output created by the current activity
    @activity-console = ''

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
    @_print-header yellow, yes
    @console = ''
    @error-message = ''
    @warning-message = ''


  # called when the last started activity finished successful
  # optionally allows to define the final text to be displayed
  success: (@activity-text = @activity-text)->
    @_print-header-and-console green
    log-update.done!


  # Called on general errors
  error: (@error-message) ->
    @_print-header red
    process.exit 1


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @_print-header yellow, yes


  set-lines: (@start-line, @end-line) ->


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update bold green "\nSuccess! #{steps-count} steps passed"


  # Called on general warnings
  warning: (@warning-message) ->
    @_print-header-and-console magenta
    log-update.done!


  _activity-header: (color, newline) ->
    result = ""
    if @documentation-file-path
      result += color "#{@documentation-file-path}"
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


  output: (text) ~>
    @activity-console += dim strip-ansi text



module.exports = ColoredFormatter
