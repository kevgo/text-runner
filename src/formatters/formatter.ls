require! {
  'chalk' : {bold, dim, green, magenta}
  'time-diff' : Time
}

# Base class for formatters
class Formatter


  ->

    # the path of the documentation file that is currently processed
    @file-path = ''

    # the line within the documentation file at which the currently processed block starts
    @start-line = null
    @end-line = null

    # the console output created by the current activity
    @console = ''

    @steps-count = 0
    @warnings-count = 0
    @files-count = 0

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

    @time = new Time
      ..start 'formatter'



  # Called when we start performing an activity that was defined in a block
  refine: (@activity-text) ->


  set-lines: (@start-line, @end-line) ->


  start: (@activity-text) ->
    @console = ''
    @error-message = ''
    @warning-message = ''
    @steps-count += 1


  # called when we start processing a markdown file
  start-file: (@file-path) ->
    @files-count += 1


  # called when the whole test suite passed
  suite-success: ->
    text = green "\nSuccess! #{@steps-count} steps in #{@files-count} files"
    if @warnings-count > 0
      text += green ", "
      text += magenta "#{@warnings-count} warnings"
    text += green ", #{@time.end 'formatter'}"
    console.log bold text


  # Called on general warnings
  warning: (@warning-message) ->
    @warnings-count += 1



module.exports = Formatter
