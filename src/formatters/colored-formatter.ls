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
      write: @_output

    @stderr =
      write: @_output

    @console =
      log: (text) ~>
        @_output "#{text}\n"



  # called when we start processing a markdown file
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity that was defined in a block
  start-activity: (@activity-text) ->
    @activity-header = "#{yellow figures.pointer} #{@documentation-file-path}:#{[@start-line, @end-line] |> compact |> unique |> (.join '-')} -- #{@activity-text}\n"
    @activity-console = ''
    @_print!


  # called when the last started activity failed
  activity-error: (message) ->
    log-update "#{red figures.cross} #{@documentation-file-path}:#{[@start-line, @end-line] |> compact |> unique |> (.join '-')} -- #{@activity-text}\n"
    log-update "\n\n#{red "Error: #{message}"}"
    process.exit 1


  # called when the last started activity finished successful
  activity-success: ->
    text = "#{green figures.tick} #{@documentation-file-path}:#{[@start-line, @end-line] |> compact |> unique |> (.join '-')} -- #{@activity-text}\n"
    log-update text
    log-update.done!
    @activity-header = ''
    @activity-console = ''


  # Called on general errors
  error: (message) ->
    text = ''
    if @documentation-file-path
      text += "#{red figures.cross} #{@documentation-file-path}"
    if @start-line > -1
      text += ":#{[@start-line, @end-line] |> compact |> unique |> (.join '-')}"
    if text.length > 0 and @activity-text
      text += ' -- '
    if @activity-text
      text += @activity-text
    if text
      text += '\n'
    text += "\n#{red "Error: #{message}"}\n"
    log-update text
    process.exit 1


  set-lines: (@start-line, @end-line) ->


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update green "\nSuccess! #{steps-count} steps passed"


  _print: ->
    log-update @activity-header + @activity-console


  _output: (text) ~>
    @activity-console += dim text
    @_print!



module.exports = ColoredFormatter
