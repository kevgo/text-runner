require! {
  '../..' : TutorialRunner
  'chai' : {expect}
  'chalk' : {strip-color}
  'dim-console'
  'jsdiff-console'
  'path'
}


class TestFormatter

  start-file: (file-path) ->
    (@file-paths or= []).push file-path.replace 'tmp/', ''

  start-activity: (activity, line) ->
    (@activities or= []).push strip-color activity
    (@lines or= []).push line

  activity-success: ->

  activity-error: (error-message = '') ->
    (@error-messages or= []).push strip-color(error-message).replace 'tmp/', ''

  error: (error-message, error-line = @documentation-file-line) !->
    (@error-messages or= []).push strip-color(error-message).replace 'tmp/', ''
    (@lines or= []).push error-line

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
    expect(@formatter.lines).to.include +table.LINE if table.LINE


  @verify-output = (table) ->
    expect(@formatter.file-paths).to.include table.FILENAME
    expect(@formatter.lines).to.include +table.LINE
    expect(@formatter.activities).to.include table.MESSAGE


  @verify-ran-console-command = (command) ->
    expect(@formatter.activities).to.include "running console command: #{command}"


  @verify-success = ->
    expect(@error).to.not.exist


  @verify-tests-run = (count) ->
    expect(@formatter.activities).to.have.length count



module.exports = ->
  @World = ApiWorld if process.env.EXOSERVICE_TEST_DEPTH is 'API'
