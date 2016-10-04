require! {
  'chai' : {expect}
  'fs-extra' : fs
  'mkdirp'
  'path'
  'tmp'
}


module.exports = ->


  @Given /^a runnable file "([^"]*)"$/ (file-path) ->
    fs.mkdir-sync path.join 'test-dir', subdir if (subdir = path.dirname file-path) isnt '.'
    fs.write-file-sync path.join('test-dir', file-path), """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """


  @Given /^I am in a directory that contains the "([^"]*)" example without a configuration file$/ (example-name) ->
    @root-dir = tmp.dir-sync unsafe-cleanup: yes
    fs.copy-sync path.join('examples' example-name),
                 @root-dir.name


  @Given /^the configuration file:$/ (content) ->
    fs.write-file-sync path.join('test-dir', 'tut-run.yml'), content


  @Given /^my workspace contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join('test-dir', file-name), content


  @Given /^my workspace contains an empty file "([^"]*)"$/ (file-name) ->
    fs.write-file-sync path.join('test-dir', file-name), ''


  @Given /^the test directory contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    base-dir = path.join 'test-dir', 'tmp'
    mkdirp.sync base-dir
    fs.write-file-sync path.join(base-dir, file-name), content



  @When /^executing the tutorial(?: runner in an empty workspace)?$/, timeout: 4000, (done) ->
    @execute cwd: 'test-dir', done


  @When /^executing the "([^"]+)" example$/, timeout: 4000, (example-name, done) ->
    @execute cwd: path.join('examples', example-name), done


  @When /^running the "([^"]*)" command$/, (command, done) ->
    @execute {command, cwd: (@root-dir?.name or 'tmp')}, done


  @When /^running tut\-run$/ (done) ->
    @execute {cwd: (@root-dir?.name or 'tmp')}, done



  @Then /^I see usage instructions$/ ->
    @verify-printed-usage-instructions!


  @Then /^it prints:$/ (expected-text) ->
    @verify-prints expected-text


  @Then /^it creates a directory "([^"]*)"$/ (directory-path) ->
    fs.stat-sync path.join 'test-dir', directory-path


  @Then /^it creates the file "([^"]*)" with the content:$/ (filename, expected-content) ->
    actual-content = fs.read-file-sync path.join(@root-dir.name, filename),
                                       encoding: 'utf8'
    expect(actual-content.trim!).to.equal expected-content.trim!


  @Then /^it runs (\d+) test$/ (count) ->
    @verify-tests-run count


  @Then /^it runs the console command "([^"]*)"$/ (command, done) ->
    @verify-ran-console-command command, done


  @Then /^it signals:$/ (table) ->
    @verify-output table.rows-hash!


  @Then /^it signals that "([^"]*)" is an unknown command$/ (command) ->
    @verify-unknown-command command


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    expect(fs.read-file-sync(path.join('test-dir', 'tmp', file-name), 'utf8').trim!).to.equal expected-content.trim!


  @Then /^the test fails with:$/ (table) ->
    @verify-failure table.rows-hash!


  @Then /^the test passes$/ ->
    @verify-success!
