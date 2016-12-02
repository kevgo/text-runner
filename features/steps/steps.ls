require! {
  'chai' : {expect}
  'child_process'
  'fs-extra' : fs
  'jsdiff-console'
  'mkdirp'
  'ncp'
  'nitroglycerin' : N
  'path'
  'prelude-ls' : {reject}
  'tmp'
}


module.exports = ->


  @Given /^a runnable file "([^"]*)"$/ (file-path) ->
    fs.mkdir-sync path.join @root-dir.name, subdir if (subdir = path.dirname file-path) isnt '.'
    fs.write-file-sync path.join(@root-dir.name, file-path), """
      <a class="tutorialRunner_createFile">
      __one.txt__

      ```
      Hello world!
      ```
      </a>
      """


  @Given /^I am in a directory that contains the "([^"]*)" example with the configuration file:$/ (example-name, config-file-content) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name
    fs.write-file-sync path.join(@root-dir.name, 'tut-run.yml'), config-file-content


  @Given /^I am in a directory that contains the "([^"]*)" example(?: without a configuration file)$/ (example-name) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name


  @Given /^I am in a directory that contains the "([^"]*)" example$/ (example-name) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name


  @Given /^my tutorial is starting the "([^"]*)" example$/ (example) ->
    fs.write-file-sync path.join(@root-dir.name, '0.md'), """
      <a class="tutorialRunner_startConsoleCommand">
      ```
      node #{path.join __dirname, '..' '..' 'examples' 'long-running' 'server.js'}
      ```
      </a>
      """


  @Given /^my workspace contains a directory "([^"]*)"$/ (dir) ->
    fs.mkdir-sync path.join(@root-dir.name, dir)


  @Given /^the configuration file:$/ (content) ->
    fs.write-file-sync path.join(@root-dir.name, 'tut-run.yml'), content


  @Given /^my workspace contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join(@root-dir.name, file-name), content


  @Given /^my workspace contains a tutorial$/ ->
    fs.write-file-sync path.join(@root-dir.name, '1.md'), '''
      <a class="tutorialRunner_runConsoleCommand">
      ```
      pwd
      ```
      </a>
    '''


  @Given /^my tut\-run configuration contains:$/ (text) ->
    fs.append-file-sync path.join(@root-dir.name, 'tut-run.yml'), "\n#{text}"


  @Given /^my workspace contains an empty file "([^"]*)"$/ (file-name) ->
    fs.write-file-sync path.join(@root-dir.name, file-name), ''


  @Given /^the test directory contains the file "([^"]*)" with the content:$/ (file-name, content) ->
    fs.write-file-sync path.join(@root-dir, file-name), content



  @When /^(trying to execute|executing) the tutorial(?: runner in an empty workspace)?$/, timeout: 4000, (trying, done) ->
    @execute command: 'run', ~>
      done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to execute|executing) the "([^"]+)" example$/, timeout: 100_000, (trying, example-name, done) ->
    ncp "examples/#{example-name}" @root-dir.name, N ~>
      child_process.exec-sync 'npm install', cwd: @root-dir.name, encoding: 'utf8'
      @execute command: 'run', ~>
        done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) the "([^"]*)" command$/, (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) "([^"]*)"$/ (trying, command, done) ->
    @execute {command, cwd: @root-dir.name}, ~>
      done if trying is 'running' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) tut\-run$/ (trying, done) ->
    @execute command: 'run', cwd: @root-dir.name, ~>
      done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)


  @When /^(trying to run|running) tut\-run with the "([^"]*)" formatter$/ (trying, formatter-name, done) ->
    @execute command: 'run', cwd: @root-dir.name, formatter: formatter-name, ~>
      done if trying is 'executing' and (@error or @exit-code) then (@error or @exit-code)



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
    all-files = fs.readdir-sync @root-dir.name, encoding: 'utf8'
    files-shouldnt-run = all-files |> reject -> it is filename
    for file-shouldnt-run in files-shouldnt-run
      expect(@output).to.not.include file-shouldnt-run
    expect(@output).to.include filename


  @Then /^it runs the console command "([^"]*)"$/ (command, done) ->
    @verify-ran-console-command command, done


  @Then /^it signals:$/ (table) ->
    @verify-output table.rows-hash!


  @Then /^it signals that "([^"]*)" is an unknown command$/ (command) ->
    @verify-unknown-command command


  @Then /^the call fails with the error:$/ (expected-error) ->
    @verify-call-error expected-error


  @Then /^the current working directory is now "([^"]*)"$/ (expected-cwd) ->
    expect(path.basename @cwd-after-run).to.equal expected-cwd


  @Then /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/ (file-name, expected-content) ->
    expect(fs.read-file-sync(path.join(@root-dir.name, file-name), 'utf8').trim!).to.equal expected-content.trim!


  @Then /^the test fails with:$/ (table) ->
    @verify-failure table.rows-hash!
