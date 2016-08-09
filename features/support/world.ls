require! {
  'chai' : {expect}
  'dim-console'
  'observable-process' : ObservableProcess
  'path'
}


World = !->

  @execute-tutorial = (done) ->
    args =
      cwd: 'tmp'
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


  @verify-failure = (expected-exit-code, expected-text) ->
    expect(@process.full-output!).to.include expected-text
    expect(@exit-code).to.equal expected-exit-code


  @verify-output = (expected-text) ->
    expect(@process.full-output!).to.include expected-text


  @verify-success = ->
    expect(@exit-code).to.equal 0


  @verify-tests-run = (count) ->
    expect(@process.full-output!).to.include " #{count} steps"



module.exports = ->
  @World = World
