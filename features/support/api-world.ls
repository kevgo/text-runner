require! {
  '../..' : TextRunner
  'chai' : {expect}
  'chalk' : {cyan}
  'dim-console'
  'fs-extra' : fs
  'glob'
  'jsdiff-console'
  'path'
  'prelude-ls' : {any, compact, filter, map, reject, unique}
  'strip-ansi'
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
    @warnings = []

  start-file: (file-path) ->
    @file-paths.push file-path unless @file-paths.includes file-path

  start: (activity) ->
    @activities.push strip-ansi activity
    @lines.push if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!
    console.log activity if @verbose

  success: (activity) ->
    if activity
      @activities[*-1] = strip-ansi activity
      console.log activity if @verbose
    console.log 'success' if @verbose

  error: (error) !->
    @error-messages.push strip-ansi(error.message or error.to-string!)
    @lines.push([@start-line, @end-line] |> unique |> compact |> (.join '-'))
    console.log error if @verbose

  output: (text) ->
    console.log text if @verbose

  refine: (activity) ->
    @activities[*-1] = strip-ansi activity
    @lines[*-1] = if @start-line isnt @end-line then "#{@start-line}-#{@end-line}" else @start-line.to-string!
    console.log activity if @verbose

  set-lines: (@start-line, @end-line) ->

  suite-success: (@steps-count) ->

  warning: (warning) !->
    @warnings.push strip-ansi(warning)
    @activities.push strip-ansi(warning)



ApiWorld = !->

  @execute = ({command, file, options}, done) ->
    existing-dir = process.cwd!
    process.chdir @root-dir.name
    @formatter = new TestFormatter {@verbose}
    (options ?= {}).format = @formatter
    @runner = new TextRunner options
      ..execute command, file, (@error) ~>
        @cwd-after-run = process.cwd!
        process.chdir existing-dir
        @output = @formatter.text
        done!


  @verify-call-error = (expected-error) ->
    jsdiff-console @error, expected-error


  @verify-errormessage = (expected-text) ->
    actual = strip-ansi(@formatter.error-messages.join!)
    expected = strip-ansi(expected-text)
    if !actual.includes expected
      throw new Error "Expected\n\n#{cyan actual}\n\nto contain\n\n#{cyan expected}\n"


  @verify-prints = (expected-text) ->
    # No way to capture console output here.
    # This is tested in the CLI world.
    return


  @verify-failure = (table) ->
    if !(@formatter.error-messages |> any (.includes table['ERROR MESSAGE']))
      throw new Error "Expected\n\n#{cyan @formatter.error-messages[0]}\n\nto contain\n\n#{cyan table['ERROR MESSAGE']}\n"
    expect(@formatter.file-paths).to.include table.FILENAME if table.FILENAME
    expect(@formatter.lines).to.include table.LINE if table.LINE


  @verify-output = (table) ->
    expect(standardize-paths @formatter.file-paths).to.include(table.FILENAME, "#{@formatter.file-paths}") if table.FILENAME
    expect(@formatter.lines).to.include table.LINE if table.LINE

    if table.MESSAGE
      activities =  @formatter.activities |> standardize-paths
      unless activities |> any (.includes table.MESSAGE)
        throw new Error "activity #{cyan table.MESSAGE} not found in #{activities}"
    expect(standardize-paths @formatter.warnings).to.include table.WARNING if table.WARNING


  @verify-ran-console-command = (command, done) ->
    wait-until (~> @formatter.activities.index-of  "running console command: #{command}" > -1), done


  @verify-ran-only-tests = (files) ->
    for file in files
      expect(@formatter.file-paths).to.include file, @formatter.file-paths

    # verify all other tests have not run
    files-shouldnt-run = glob.sync "#{@root-dir.name}/**" |> filter -> fs.stat-sync(it).is-file!
                                                          |> map ~> path.relative @root-dir.name, it
                                                          |> compact
                                                          |> map (.replace /\\/g, '/')
                                                          |> reject -> files.index-of it > -1
    for file-shouldnt-run in files-shouldnt-run
      expect(@formatter.file-paths).to.not.include file-shouldnt-run


  @verify-tests-run = (count) ->
    expect(@formatter.activities).to.have.length count


  @verify-unknown-command = (command) ->
    expect(@error).to.equal "unknown command: #{command}"


function standardize-paths paths
  paths |> map (.replace /\\/g, '/')



module.exports = ->
  @World = ApiWorld if process.env.EXOSERVICE_TEST_DEPTH is 'API'
