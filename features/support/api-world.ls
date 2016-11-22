require! {
  '../..' : TutorialRunner
  'chai' : {expect}
  'chalk' : {strip-color}
  'dim-console'
  'jsdiff-console'
  'path'
  'prelude-ls' : {compact, unique}
  'wait' : {wait-until}
}


class TestFormatter

  ({@verbose}) ->
    @activities = []
    @error-messages = []
    @file-paths = []
    @lines = []
    @text = ''
    @console = log: (text) ~> @text += "#{text}\n"
    @stdout = write: (text) ~> @text += text
    @stderr = write: (text) ~> @text += text

  start-file: (file-path) ->
    @file-paths.push file-path

  start: (activity) ->
    @activities.push strip-color activity
    @lines.push if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!
    console.log activity if @verbose

  success: ->
    console.log 'success' if @verbose

  error: (error) !->
    @error-messages.push strip-color(error.message or error.to-string!)
    @lines.push([@start-line, @end-line] |> unique |> compact |> (.join '-'))
    console.log error if @verbose

  output: (text) ->
    console.log text if @verbose

  refine: (activity) ->
    @activities[*-1] = strip-color activity
    @lines[*-1] = if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!
    console.log activity if @verbose

  set-lines: (@start-line, @end-line) ->

  suite-success: (@steps-count) ->



ApiWorld = !->

  @execute = ({command, formatter}, done) ->
    existing-dir = process.cwd!
    process.chdir @root-dir.name
    @formatter = new TestFormatter {@verbose}
    @runner = new TutorialRunner {@formatter}
      ..execute command, (@error) ~>
        @cwd-after-run = process.cwd!
        process.chdir existing-dir
        @output = @formatter.text
        done!


  @verify-call-error = (expected-error) ->
    jsdiff-console @error, expected-error


  @verify-prints = (expected-text) ->
    # No way to capture console output here.
    # This is tested in the CLI world.
    return


  @verify-failure = (table) ->
    expect(@formatter.error-messages).to.include table['ERROR MESSAGE']
    expect(@formatter.file-paths).to.include table.FILENAME if table.FILENAME
    expect(@formatter.lines).to.include table.LINE if table.LINE


  @verify-output = (table) ->
    expect(@formatter.file-paths).to.include table.FILENAME
    expect(@formatter.lines).to.include table.LINE
    expect(@formatter.activities).to.include table.MESSAGE


  @verify-ran-console-command = (command, done) ->
    wait-until (~> @formatter.activities.index-of  "running console command: #{command}" > -1), done


  @verify-tests-run = (count) ->
    expect(@formatter.activities).to.have.length count


  @verify-unknown-command = (command) ->
    expect(@error).to.equal "unknown command: #{command}"



module.exports = ->
  @World = ApiWorld if process.env.EXOSERVICE_TEST_DEPTH is 'API'
