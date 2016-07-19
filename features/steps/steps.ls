 require! {
   'chai' : {expect}
   'dim-console'
   'observable-process' : ObservableProcess
   'path'
 }


module.exports = ->

  @Given /^I am in the directory of the tutorial "([^"]*)"$/ (name) ->
     @app-dir = path.join process.cwd!, 'features', 'example-tutorials', name



  @When /^running "([^"]*)"$/ (command, done) ->
    args =
      cwd: @app-dir
      console: off
    if @verbose
      args.console = dim-console.console
    @process = new ObservableProcess path.join(process.cwd!, 'bin', command), args
      ..on 'ended', (@exit-code) ~> done!



  @Then /^the test fails with exit code (\d+) and the error:$/ (+expected-exit-code, expected-text) ->
    expect(@process.full-output!).to.include expected-text
    expect(@exit-code).to.equal expected-exit-code

