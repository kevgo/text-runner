require! {
  'chai' : {expect}
  'fs-extra' : fs
  'glob'
  'jsdiff-console'
  'path'
  'prelude-ls' : {compact, filter, map, reject}
}


module.exports = ->

  @Then /^I see usage instructions$/ ->
    @verify-printed-usage-instructions!


  @Then /^it creates a directory "([^"]*)"$/ (directory-path) ->
    fs.stat-sync path.join @root-dir.name, directory-path


  @Then /^it creates the file "([^"]*)" with content:$/ (filename, expected-content) ->
    actual-content = fs.read-file-sync path.join(@root-dir.name, filename),
                                       encoding: 'utf8'
    jsdiff-console actual-content.trim!, expected-content.trim!


  @Then /^it prints:$/ (expected-text) ->
    @verify-prints expected-text


  @Then /^it runs (\d+) test$/ (count) ->
    @verify-tests-run count


  @Then /^it runs in a global temp directory$/ ->
    expect(@output).to.not.include @root-dir.name


  @Then /^it runs in the "([^"]+)" directory$/ (dir-name) ->
    expect(@output).to.match new RegExp("#{dir-name}\\b")


  @Then /^it runs in the current working directory$/ ->
    expect(@output).to.match new RegExp("#{@root-dir.name}\\b")


  @Then /^it runs(?: only)? the tests in "([^"]*)"$/ (filename) ->
    @verify-ran-only-tests [filename]


  @Then /^it runs only the tests in:$/ (table) ->
    @verify-ran-only-tests table.raw![0]


  @Then /^it runs the console command "([^"]*)"$/ (command, done) ->
    @verify-ran-console-command command, done


  @Then /^it signals:$/ (table) ->
    @verify-output table.rows-hash!


  @Then /^the call fails with the error:$/ (expected-error) ->
    @verify-call-error expected-error


  @Then /^the current working directory is now "([^"]*)"$/ (expected-cwd) ->
    expect(path.basename @cwd-after-run).to.equal expected-cwd


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    expect(fs.read-file-sync(path.join(@root-dir.name, 'tmp', file-name), 'utf8').trim!).to.equal expected-content.trim!


  @Then /^the test workspace now contains a directory "([^"]*)"$/ (file-name) ->
    stat = fs.stat-sync path.join(@root-dir.name, 'tmp', file-name)
    expect(stat.is-directory!).to.be.true


  @Then /^the test fails with:$/ (table) ->
    @verify-failure table.rows-hash!
