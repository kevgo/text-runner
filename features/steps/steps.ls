 require! {
   'chai' : {expect}
   'dim-console'
   'fs'
   'observable-process' : ObservableProcess
   'path'
 }


module.exports = ->

  @Given /^I am in the directory of the tutorial "([^"]*)"$/ (name) ->
     @app-dir = path.join process.cwd!, 'features', 'example-tutorials', name


  @Given /^I am in a directory containing a file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join('tmp', file-name), content


  @Given /^I am in a directory containing an empty file "([^"]*)"$/ (file-name) ->
    fs.write-file-sync path.join('tmp', file-name), ''


  @Given /^the file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join('tmp', file-name), content



  @When /^running "([^"]*)"(?: in an empty directory)?$/ (command, done) ->
    args =
      cwd: 'tmp'
      console: off
      env: {}
    if @verbose
      args.console = dim-console.console
    if @debug
      args.env['DEBUG'] = '*'
    @process = new ObservableProcess path.join(process.cwd!, 'bin', command), args
      ..on 'ended', (@exit-code) ~> done!



  @Then /^it prints:$/ (expected-text) ->
    expect(@process.full-output!).to.include expected-text


  @Then /^the directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    expect(fs.read-file-sync path.join('tmp', file-name), 'utf8').to.equal expected-content


  @Then /^the test fails with exit code (\d+) and the error:$/ (+expected-exit-code, expected-text) ->
    expect(@process.full-output!).to.include expected-text
    expect(@exit-code).to.equal expected-exit-code

  @Then /^the test passes$/ ->
    expect(@exit-code).to.equal 0
