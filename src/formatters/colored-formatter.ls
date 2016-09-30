require! {
  'chalk' : {dim, green, red, yellow}
  'figures'
  'indent-string'
  'log-update'
  'prelude-ls' : {compact, unique}
}


# The standard formatter
class ColoredFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @start-line = null
    @end-line = null

    # the header for the current activity, which will be printed differently later
    @activity-header = ''

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
    @activity-header = "#{@_format yellow figures.pointer}\n"
    @activity-console = ''
    @_print!


  # called when the last started activity finished successful
  success: ->
    @activity-header = @_format green figures.tick
    @activity-console = ''
    @_print!
    log-update.done!
    @activity-header = ''


  # Called on general errors
  error: (message) ->
    @activity-header = "#{@_format red figures.cross}\n#{red "Error: #{message}"}\n"
    @_print!
    process.exit 1


  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->
    @activity-header = "#{@_format yellow figures.pointer}\n"
    @_print!


  set-lines: (@start-line, @end-line) ->


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update green "\nSuccess! #{steps-count} steps passed"


  _format: (figure) ->
    result = "#{figure} "
    if @documentation-file-path
      result += "#{@documentation-file-path}"
      if @start-line
        result += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
      result += " -- "
    result += "#{@activity-text}"
    result


  _print: ->
    log-update @activity-header + @activity-console


  output: (text) ~>
    @activity-console += dim text
    @_print!



module.exports = ColoredFormatter
