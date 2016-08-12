require! {
  'chalk' : {dim, green, red, yellow}
  'figures'
  'indent-string'
  'log-update'
}


# The standard formatter
class ColoredFormatter

  ->

    # the path of the documentation file that is currently processed
    @documentation-file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @documentation-file-line = -1

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



  # called when we start processing a markdown file
  start-file: (@documentation-file-path) ->


  # Called when we start performing an activity that was defined in a block
  start-activity: (@activity-text, @documentation-file-line) ->
    @activity-header = "#{yellow figures.pointer} #{@documentation-file-path}:#{@documentation-file-line} -- #{@activity-text}"
    @activity-console = ''
    @_print!


  # called when the last started activity finished successful
  activity-success: ->
    text = "#{green figures.tick} #{@documentation-file-path}:#{@documentation-file-line} -- #{@activity-text}"
    if @activity-console
      text += "\n#{@activity-console.trim! |> indent-string _, 2 |> dim}"
    log-update text
    log-update.done!
    @activity-header = ''
    @activity-console = ''


  # called when the last started activity failed
  activity-error: (message) ->
    log-update "#{red figures.cross} #{@documentation-file-path}:#{@documentation-file-line} -- #{@activity-text}\n"
    log-update "\n\n#{red "Error: #{message}"}"
    process.exit 1


  # Called on general errors
  error: (message, line = @documentation-file-line) ->
    text = ''
    if @documentation-file-path
      text += "#{red figures.cross} #{@documentation-file-path}"
    if line > -1
      text += ":#{line}"
    if text.length > 0 and @activity-text
      text += ' -- '
    if @activity-text
      text += @activity-text
    if text
      text += '\n'
    text += "\n#{red "Error: #{message}"}\n"
    log-update text
    process.exit 1


  # called when the whole test suite passed
  suite-success: (steps-count) ->
    log-update green "\nSuccess! #{steps-count} steps passed"


  _print: ->
    log-update @activity-header + @activity-console


  _output: (text) ~>
    @activity-console += dim text
    @_print!



module.exports = ColoredFormatter
