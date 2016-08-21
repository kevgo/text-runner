require! {
  'chai' : {expect}
  'fs'
  'mkdirp'
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



  @When /^executing the tutorial(?: runner in an empty workspace)?$/ (done) ->
    @execute-tutorial done


  @When /^executing the "([^"]*)" example/, timeout: 3000, (example-name, done) ->
    @execute-example example-name, done



  @Then /^it creates a directory "([^"]*)"$/ (directory-path) ->
    fs.stat-sync path.join 'tmp', directory-path


  @Then /^it runs (\d+) test$/ (count) ->
    @verify-tests-run count


  @Then /^it runs the console command "([^"]*)"$/ (command) ->
    @verify-ran-console-command command


  @Then /^it signals:$/ (table) ->
    @verify-output table.rows-hash!


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    # The first "tmp" folder is for Cucumber (it creates the Markdown test files in there.
    # The second "tmp" folder is created by Tutorial Runner
    expect(fs.read-file-sync(path.join('tmp', 'tmp', 'tut-run', file-name), 'utf8').trim!).to.equal expected-content.trim!


  @Then /^the test fails with:$/ (table) ->
    @verify-failure table.rows-hash!


  @Then /^the test passes$/ ->
    @verify-success!
