require! {
  '../..' : TutorialRunner
  'chai' : {expect}
  'chalk' : {strip-color}
  'dim-console'
  'jsdiff-console'
  'path'
  'prelude-ls' : {compact, unique}
}


class TestFormatter
  ->
    @console =
      log: ->

  start-file: (file-path) ->
    (@file-paths or= []).push file-path.replace 'tmp/', ''

  start-activity: (activity) ->
    (@activities or= []).push strip-color activity
    (@lines or= []).push if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!

  activity-success: ->

  activity-error: (error-message = '') ->
    (@error-messages or= []).push strip-color(error-message).replace 'tmp/', ''

  error: (error-message) !->
    (@error-messages or= []).push strip-color(error-message).replace 'tmp/', ''
    (@lines or= []).push([@start-line, @end-line] |> unique |> compact |> (.join '-'))

  refine-activity: (activity) ->
    (@activities or= [])[*-1] = strip-color activity
    (@lines or= [])[*-1] = if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!

  set-lines: (@start-line, @end-line) ->

  suite-success: (@steps-count) ->



ApiWorld = !->

  @execute-example = (example-name, done) ->
    process.chdir path.join('examples', example-name)
    @formatter = new TestFormatter
    @runner = new TutorialRunner @formatter
      ..run (@error) ~>
        process.chdir path.join('..', '..')
        done!


  @execute-tutorial = (done) ->
    process.chdir 'tmp'
    @formatter = new TestFormatter
    @runner = new TutorialRunner @formatter
      ..run (@error) ~>
        process.chdir '..'
        done!


  @verify-failure = (table) ->
    expect(@formatter.error-messages).to.include table['ERROR MESSAGE']
    expect(@formatter.file-paths).to.include table.FILENAME if table.FILENAME
    expect(@formatter.lines).to.include table.LINE if table.LINE


  @verify-output = (table) ->
    expect(@formatter.file-paths).to.include table.FILENAME
    expect(@formatter.lines).to.include table.LINE
    expect(@formatter.activities).to.include table.MESSAGE


  @verify-ran-console-command = (command) ->
    expect(@formatter.activities).to.include "running console command: #{command}"


  @verify-success = ->
    expect(@error).to.not.exist


  @verify-tests-run = (count) ->
    expect(@formatter.activities).to.have.length count



module.exports = ->
  @World = ApiWorld if process.env.EXOSERVICE_TEST_DEPTH is 'API'
