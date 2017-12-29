// @flow

const {defineSupportCode} = require('cucumber')
const fs = require('fs-extra')
const mkdirp = require('mkdirp')
const {cp} = require('shelljs')
const path = require('path')

defineSupportCode(function ({Given}) {
  Given(/^a broken file "([^"]*)"$/, function (filePath) {
    const subdir = path.dirname(filePath)
    if (subdir !== '.') {
      mkdirp.sync(path.join(this.rootDir.name, subdir))
    }
    fs.writeFileSync(path.join(this.rootDir.name, filePath), `
      <a href="missing">
      </a>
      `)
  })

  Given(/^a runnable file "([^"]*)"$/, function (filePath) {
    const subdir = path.dirname(filePath)
    if (subdir !== '.') {
      const subdirPath = path.join(this.rootDir.name, subdir)
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath)
      }
    }
    fs.writeFileSync(path.join(this.rootDir.name, filePath),
                     '<a class="tr_verifyWorkspaceContainsDirectory">`.`</a>')
  })

  Given(/^I am in a directory that contains documentation without a configuration file$/, function () {
    fs.writeFileSync(path.join(this.rootDir.name, '1.md'), `
      <a class="tr_verifySourceContainsDirectory">
        [.](.)
      </a>
      `)
  })

  Given(/^I am in a directory that contains the "([^"]*)" example$/, function (exampleName) {
    fs.copySync(path.join('examples', exampleName), this.rootDir.name)
  })

  Given(/^I am in a directory that contains the "([^"]*)" example with the configuration file:$/, function (exampleName, configFileContent) {
    fs.copySync(path.join('examples', exampleName), this.rootDir.name)
    fs.writeFileSync(path.join(this.rootDir.name, 'text-run.yml'), configFileContent)
  })

  Given(/^I am in a directory that contains the "([^"]*)" example(?: without a configuration file)$/, function (exampleName) {
    fs.copySync(path.join('examples', exampleName), this.rootDir.name)
  })

  Given(/^my documentation is starting the "([^"]*)" example$/, function (example) {
    fs.writeFileSync(path.join(this.rootDir.name, '0.md'), `
      <a class="tr_startConsoleCommand">
      \`\`\`
      node ${path.join(__dirname, '..', '..', 'examples', 'long-running', 'server.js')}
      \`\`\`
      </a>
      `)
  })

  Given(/^my source code contains the directory "([^"]*)"$/, function (dirName) {
    mkdirp.sync(path.join(this.rootDir.name, dirName))
  })

  Given(/^my source code contains the file "([^"]*)"$/, function (fileName) {
    mkdirp.sync(path.join(this.rootDir.name, path.dirname(fileName)))
    fs.writeFileSync(path.join(this.rootDir.name, fileName), 'content')
  })

  Given(/^my workspace contains the file "([^"]*)"$/, function (fileName) {
    mkdirp.sync(path.join(this.rootDir.name, 'tmp', path.dirname(fileName)))
    fs.writeFileSync(path.join(this.rootDir.name, 'tmp', fileName), 'content')
  })

  Given(/^my source code contains the file "([^"]*)" with content:$/, function (fileName, content) {
    mkdirp.sync(path.join(this.rootDir.name, path.dirname(fileName)))
    fs.writeFileSync(path.join(this.rootDir.name, fileName), content)
  })

  Given(/^my workspace contains testable documentation$/, function () {
    fs.writeFileSync(path.join(this.rootDir.name, '1.md'), `
<a class="tr_runConsoleCommand">
\`\`\`
echo "Hello world"
\`\`\`
</a>
    `)
  })

  Given(/^my workspace contains the file "([^"]*)" with content:$/, function (fileName, content) {
    mkdirp.sync(path.join(this.rootDir.name, 'tmp', path.dirname(fileName)))
    fs.writeFileSync(path.join(this.rootDir.name, 'tmp', fileName), content)
  })

  Given(/^my text\-run configuration contains:$/, function (text) {
    fs.appendFileSync(path.join(this.rootDir.name, 'text-run.yml'), `\n${text}`)
  })

  Given(/^my workspace contains a directory "([^"]*)"$/, function (dir) {
    mkdirp.sync(path.join(this.rootDir.name, 'tmp', dir))
  })

  Given(/^my workspace contains an empty file "([^"]*)"$/, function (fileName) {
    fs.writeFileSync(path.join(this.rootDir.name, fileName), '')
  })

  Given(/^my workspace contains an image "([^"]*)"$/, function (imageName) {
    mkdirp.sync(path.join(this.rootDir.name, path.dirname(imageName)))
    cp(path.join(__dirname, path.basename(imageName)),
       path.join(this.rootDir.name, imageName))
  })

  Given(/^the configuration file:$/, function (content) {
    fs.writeFileSync(path.join(this.rootDir.name, 'text-run.yml'), content)
  })
})
