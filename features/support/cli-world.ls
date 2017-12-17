require! {
  'chai' : {expect}
  'dim-console'
  'fs-extra' : fs
  'glob'
  'observable-process' : ObservableProcess
  'path'
  'prelude-ls' : {compact, filter, map, reject}
}


CliWorld = !->

  @execute = ({command, options, expect-error}, done) ->
    args =
      cwd: @root-dir.name
      stdout: off
      stderr: off
      env: {}
    if @verbose
      args.stdout = dim-console.process.stdout
      args.stderr = dim-console.process.stderr
    else
      args.stdout = write: (text) ~> @output += text
      args.stderr = write: (text) ~> @output += text
    if @debug
      args.env['DEBUG'] = '*'
    @process = new ObservableProcess @make-full-path(command), args
      ..on 'ended', (@exit-code) ~>
        @output = dim-console.output if @verbose
        if @exit-code and not expect-error
          console.log @output
        done!


  @make-full-path = (command) ->
    if /^text-run/.test command
      command.replace /^text-run/, @full-text-run-path!
    else
      "#{@full-text-run-path!} #{command}"


  @full-text-run-path = ->
    result = path.join(process.cwd!, 'bin', 'text-run')
    if process.platform is 'win32'
      result += '.cmd'
    result


  @verify-call-error = (expected-error) ->
    output = @process.full-output!
    expect(output).to.include expected-error
    expect(@exit-code).to.equal 1


  @verify-errormessage = (expected-text) ->
    expect(@process.full-output!).to.include expected-text


  @verify-failure = (table) ->
    output = @process.full-output!
    expected-header = switch
      | table.FILENAME and table.LINE  =>  "#{table.FILENAME}:#{table.LINE}"
      | table.FILENAME                 =>  "#{table.FILENAME}"
      | _                              =>  ''
    if table['MESSAGE']
      expected-header += " -- #{table['MESSAGE']}"
    expect(output).to.include expected-header
    expect(output).to.include table['ERROR MESSAGE']
    expect(@exit-code).to.equal +table['EXIT CODE']


  @verify-output = (table) ->
    expected-text = ""
    expected-text += table.FILENAME if table.FILENAME
    expected-text += ":#{table.LINE}" if table.FILENAME and table.LINE
    expected-text += ' -- ' if table.FILENAME and (table.MESSAGE or table.WARNING)
    expected-text += table.MESSAGE if table.MESSAGE
    expected-text += table.WARNING if table.WARNING
    expect(@process.full-output! |> standardize-path).to.include expected-text


  @verify-printed-usage-instructions = ->
    expect(@process.full-output!).to.include 'COMMANDS'


  @verify-prints = (expected-text) ->
    expect(new RegExp(expected-text).test @process.full-output!).to.be.true


  @verify-ran-console-command = (command, done) ->
    expect(@process.full-output!).to.include "running.md:1-5 -- running console command: #{command}"
    done!


  @verify-ran-only-tests = (filenames) ->
    standardized-output = @output.replace /\\/g, '/'

    # verify the given tests have run
    for filename in filenames
      expect(standardized-output).to.include filename

    # verify all other tests have not run
    files-shouldnt-run = glob.sync "#{@root-dir.name}/**" |> filter -> fs.stat-sync(it).is-file!
                                                          |> map ~> path.relative @root-dir.name, it
                                                          |> compact
                                                          |> map (.replace /\\/g, '/')
                                                          |> reject -> filenames.index-of it > -1
    for file-shouldnt-run in files-shouldnt-run
      expect(standardized-output).to.not.include file-shouldnt-run


  @verify-tests-run = (count) ->
    expect(@process.full-output!).to.include " #{count} steps"

  @verify-unknown-command = (command) ->
    expect(@process.full-output!).to.include "unknown command: #{command}"


function standardize-path path
  path.replace /\\/g, '/'



module.exports = ->
  @World = CliWorld if process.env.EXOSERVICE_TEST_DEPTH is 'CLI'
