require! {
  'fs-extra' : fs
  'mkdirp'
  'path'
}


module.exports = ->

  @Given /^a broken file "([^"]*)"$/ (file-path) ->
    if (subdir = path.dirname file-path) isnt '.'
      mkdirp.sync path.join(@root-dir.name, subdir)
    fs.write-file-sync path.join(@root-dir.name, file-path), """
      <a href="missing">
      </a>
      """


  @Given /^a runnable file "([^"]*)"$/ (file-path) ->
    if (subdir = path.dirname file-path) isnt '.'
      subdir-path = path.join @root-dir.name, subdir
      if not fs.exists-sync subdir-path
        fs.mkdir-sync subdir-path
    fs.write-file-sync path.join(@root-dir.name, file-path), """
      <a class="tr_verifyWorkspaceContainsDirectory">
        `.`
      </a>
      """


  @Given /^I am in a directory that contains documentation without a configuration file$/ ->
    fs.write-file-sync path.join(@root-dir.name, '1.md'), """
      <a class="tr_verifySourceContainsDirectory">
        [.](.)
      </a>
      """


  @Given /^I am in a directory that contains the "([^"]*)" example with the configuration file:$/ (example-name, config-file-content) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name
    fs.write-file-sync path.join(@root-dir.name, 'text-run.yml'), config-file-content


  @Given /^I am in a directory that contains the "([^"]*)" example(?: without a configuration file)$/ (example-name) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name


  @Given /^I am in a directory that contains the "([^"]*)" example$/ (example-name) ->
    fs.copy-sync path.join('examples' example-name), @root-dir.name


  @Given /^my documentation is starting the "([^"]*)" example$/ (example) ->
    fs.write-file-sync path.join(@root-dir.name, '0.md'), """
      <a class="tr_startConsoleCommand">
      ```
      node #{path.join __dirname, '..' '..' 'examples' 'long-running' 'server.js'}
      ```
      </a>
      """


  @Given /^my workspace contains a directory "([^"]*)"$/ (dir) ->
    mkdirp.sync path.join(@root-dir.name, 'tmp', dir)


  @Given /^my workspace contains an image "([^"]*)"$/ (image-name) ->
    mkdirp.sync path.join(@root-dir.name, path.dirname(image-name))
    cp path.join(__dirname, path.basename(image-name)),
       path.join(@root-dir.name, image-name)


  @Given /^the configuration file:$/ (content) ->
    fs.write-file-sync path.join(@root-dir.name, 'text-run.yml'), content


  @Given /^my source code contains the directory "([^"]*)"$/ (dir-name) ->
    mkdirp.sync path.join(@root-dir.name, dir-name)


  @Given /^my source code contains the file "([^"]*)"$/ (file-name) ->
    mkdirp.sync path.join(@root-dir.name, path.dirname(file-name))
    fs.write-file-sync path.join(@root-dir.name, file-name), 'content'


  @Given /^my workspace contains the file "([^"]*)"$/ (file-name) ->
    mkdirp.sync path.join(@root-dir.name, 'tmp', path.dirname(file-name)), (err) ~>
    fs.write-file-sync path.join(@root-dir.name, 'tmp', file-name), 'content'


  @Given /^my source code contains the file "([^"]*)" with content:$/ (file-name, content) ->
    mkdirp.sync path.join(@root-dir.name, path.dirname(file-name))
    fs.write-file-sync path.join(@root-dir.name, file-name), content


  @Given /^my workspace contains the file "([^"]*)" with content:$/ (file-name, content) ->
    mkdirp.sync path.join(@root-dir.name, 'tmp', path.dirname(file-name))
    fs.write-file-sync path.join(@root-dir.name, 'tmp', file-name), content


  @Given /^my workspace contains testable documentation$/ ->
    fs.write-file-sync path.join(@root-dir.name, '1.md'), '''
      <a class="tr_runConsoleCommand">
      ```
      echo "Hello world"
      ```
      </a>
    '''


  @Given /^my text\-run configuration contains:$/ (text) ->
    fs.append-file-sync path.join(@root-dir.name, 'text-run.yml'), "\n#{text}"


  @Given /^my workspace contains an empty file "([^"]*)"$/ (file-name) ->
    fs.write-file-sync path.join(@root-dir.name, file-name), ''
