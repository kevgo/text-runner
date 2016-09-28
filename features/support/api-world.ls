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
  ->
    @activities = []
    @console = log: ->
    @error-messages = []
    @file-paths = []
    @lines = []

  start-file: (file-path) ->
    @file-paths.push file-path.replace 'test-dir/', ''

  start: (activity) ->
    @activities.push strip-color activity
    @lines.push if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!

  success: ->

  error: (error-message) !->
    @error-messages.push strip-color(error-message).replace 'test-dir/', ''
    @lines.push([@start-line, @end-line] |> unique |> compact |> (.join '-'))

  refine: (activity) ->
    @activities[*-1] = strip-color activity
    @lines[*-1] = if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!

  set-lines: (@start-line, @end-line) ->

  suite-success: (@steps-count) ->



ApiWorld = !->

  @execute-example = (example-name, done) ->
    process.chdir path.join('examples', example-name)
    @formatter = new TestFormatter
    @runner = new TutorialRunner {@formatter}
      ..run (@error) ~>
        process.chdir path.join('..', '..')
        done!


  @execute-tutorial = (done) ->
    process.chdir 'test-dir'
    @formatter = new TestFormatter
    @runner = new TutorialRunner {@formatter}
      ..run (@error) ~>
        process.chdir '..'
        done!


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


  @verify-success = ->
    expect(@error).to.not.exist


  @verify-tests-run = (count) ->
    expect(@formatter.activities).to.have.length count



module.exports = ->
  @World = ApiWorld if process.env.EXOSERVICE_TEST_DEPTH is 'API'
