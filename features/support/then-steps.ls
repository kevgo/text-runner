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


  @Then /^it prints:$/ (expected-text) ->
    @verify-prints expected-text


  @Then /^it creates a directory "([^"]*)"$/ (directory-path) ->
    fs.stat-sync path.join @root-dir.name, directory-path


  @Then /^it creates the file "([^"]*)" with the content:$/ (filename, expected-content) ->
    actual-content = fs.read-file-sync path.join(@root-dir.name, filename),
                                       encoding: 'utf8'
    jsdiff-console actual-content.trim!, expected-content.trim!


  @Then /^it runs (\d+) test$/ (count) ->
    @verify-tests-run count


  @Then /^it runs in a global temp directory$/ ->
    expect(@output).to.not.include @root-dir.name


  @Then /^it runs in the current working directory$/ ->
    expect(@output).to.include @root-dir.name


  @Then /^it runs only the tests in "([^"]*)"$/ (filename) ->
    expect(@output).to.include filename

    # verify that all other files have not run
    all-files = glob.sync "#{@root-dir.name}/**" |> filter -> fs.stat-sync(it).is-file!
                                                 |> map ~> path.relative @root-dir.name, it
                                                 |> compact
    files-shouldnt-run = all-files |> reject (is filename)
    for file-shouldnt-run in files-shouldnt-run
      expect(@output).to.not.include file-shouldnt-run


  @Then /^it runs the console command "([^"]*)"$/ (command, done) ->
    @verify-ran-console-command command, done


  @Then /^it signals:$/ (table) ->
    @verify-output table.rows-hash!


  @Then /^the call fails with the error:$/ (expected-error) ->
    @verify-call-error expected-error


  @Then /^the current working directory is now "([^"]*)"$/ (expected-cwd) ->
    expect(path.basename @cwd-after-run).to.equal expected-cwd


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    expect(fs.read-file-sync(path.join(@root-dir.name, file-name), 'utf8').trim!).to.equal expected-content.trim!


  @Then /^the test fails with:$/ (table) ->
    @verify-failure table.rows-hash!
