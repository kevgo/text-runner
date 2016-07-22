 require! {
   'chai' : {expect}
   'dim-console'
   'fs'
   'mkdirp'
   'observable-process' : ObservableProcess
   'path'
 }


module.exports = ->


  @Given /^a runnable file "([^"]*)"$/ (file-path) ->
    fs.mkdir-sync path.join 'tmp', subdir if (subdir = path.dirname file-path) isnt '.'
    fs.write-file-sync path.join('tmp', file-path), """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """


  @Given /^my workspace contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join('tmp', file-name), content


  @Given /^my workspace contains an empty file "([^"]*)"$/ (file-name) ->
    fs.write-file-sync path.join('tmp', file-name), ''


  @Given /^the test directory contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    base-dir = path.join 'tmp', 'tmp', 'tut-run'
    mkdirp.sync base-dir
    fs.write-file-sync path.join(base-dir, file-name), content



  @When /^running "([^"]*)"(?: in an empty workspace)?$/ (command, done) ->
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



  @Then /^it creates a directory "([^"]*)"$/ (directory-path) ->
    fs.stat-sync path.join 'tmp', directory-path


  @Then /^it runs (\d+) test$/ (count) ->
    expect(@process.full-output!).to.include " #{count} steps"


  @Then /^it prints:$/ (expected-text) ->
    expect(@process.full-output!).to.include expected-text


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    # The first "tmp" folder is for Cucumber (it creates the Markdown test files in there.
    # The second "tmp" folder is created by Tutorial Runner
    expect(fs.read-file-sync path.join('tmp', 'tmp', 'tut-run', file-name), 'utf8').to.equal expected-content


  @Then /^the test fails with exit code (\d+) and the error:$/ (+expected-exit-code, expected-text) ->
    expect(@process.full-output!).to.include expected-text
    expect(@exit-code).to.equal expected-exit-code


  @Then /^the test passes$/ ->
    expect(@exit-code).to.equal 0
