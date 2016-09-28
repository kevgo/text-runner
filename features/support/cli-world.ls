require! {
  'chai' : {expect}
  'dim-console'
  'observable-process' : ObservableProcess
  'path'
}


CliWorld = !->

  @execute-example = (example-name, done) ->
    args =
      cwd: "examples/#{example-name}"
      stdout: off
      stderr: off
      env: {}
    if @verbose
      args.stdout = dim-console.process.stdout
      args.stderr = dim-console.process.stderr
    if @debug
      args.env['DEBUG'] = '*'
    @process = new ObservableProcess path.join(process.cwd!, 'bin', 'tut-run'), args
      ..on 'ended', (@exit-code) ~> done!


  @execute-tutorial = (done) ->
    args =
      cwd: 'test-dir'
      stdout: off
      stderr: off
      env: {}
    if @verbose
      args.stdout = dim-console.process.stdout
      args.stderr = dim-console.process.stderr
    if @debug
      args.env['DEBUG'] = '*'
    @process = new ObservableProcess path.join(process.cwd!, 'bin', 'tut-run'), args
      ..on 'ended', (@exit-code) ~> done!


  @verify-failure = (table) ->
    output = @process.full-output!
    expected-header = switch
      | table.FILENAME and table.LINE  =>  "#{table.FILENAME}:#{table.LINE}"
      | table.FILENAME                 =>  "#{table.FILENAME}"
      | _                              =>  ''
    if table['MESSAGE']
      expected-header += " -- #{table['MESSAGE']}"
    expect(output).to.include expected-header
    expect(output).to.include "Error: #{table['ERROR MESSAGE']}"
    expect(@exit-code).to.equal +table['EXIT CODE']


  @verify-output = (table) ->
    expect(@process.full-output!).to.include "#{table.FILENAME}:#{table.LINE} -- #{table.MESSAGE}"


  @verify-prints = (expected-text) ->
    expect(@process.full-output!).to.include expected-text


  @verify-ran-console-command = (command, done) ->
    expect(@process.full-output!).to.include "running.md:1-5 -- running console command: #{command}"
    done!


  @verify-success = ->
    expect(@exit-code).to.equal 0


  @verify-tests-run = (count) ->
    expect(@process.full-output!).to.include " #{count} steps"



module.exports = ->
  @World = CliWorld if process.env.EXOSERVICE_TEST_DEPTH is 'CLI'
