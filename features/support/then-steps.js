// @flow

const {defineSupportCode} = require('cucumber')
const {expect} = require('chai')
const fs = require('fs-extra')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

defineSupportCode(function ({Then, When}) {
  Then(/^I see usage instructions$/, function () {
    this.verifyPrintedUsageInstructions()
  })

  Then(/^it creates a directory "([^"]*)"$/, function (directoryPath) {
    fs.statSync(path.join(this.rootDir, directoryPath))
  })

  Then(/^it creates the file "([^"]*)" with content:$/, function (filename, expectedContent) {
    const actualContent = fs.readFileSync(path.join(this.rootDir, filename),
                                          {encoding: 'utf8'})
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
  })

  Then(/^it prints:$/, function (expectedText) {
    this.verifyPrints(expectedText)
  })

  Then(/^it prints the error message:$/, function (expectedText) {
    this.verifyErrormessage(expectedText)
  })

  Then(/^it runs (\d+) test$/, function (count) {
    this.verifyTestsRun(count)
  })

  Then(/^it runs in a global temp directory$/, function () {
    expect(this.output).to.not.include(this.rootDir)
  })

  Then(/^it runs in the "([^"]+)" directory$/, function (dirName) {
    expect(this.output).to.match(new RegExp(`${dirName}\\b`))
  })

  Then(/^it runs in the current working directory$/, function () {
    expect(this.output).to.match(new RegExp(`${this.rootDir}\\b`))
  })

  Then(/^it runs(?: only)? the tests in "([^"]*)"$/, function (filename) {
    this.verifyRanOnlyTests([filename])
  })

  Then(/^it runs only the tests in:$/, function (table) {
    this.verifyRanOnlyTests(table.raw())
  })

  Then(/^it runs the console command "([^"]*)"$/, function (command, done) {
    this.verifyRanConsoleCommand(command, done)
  })

  Then(/^it runs without errors$/, function () {
  })

  Then(/^it signals:$/, function (table) {
    this.verifyOutput(table.rowsHash())
  })

  Then(/^the call fails with the error:$/, function (expectedError) {
    this.verifyCallError(expectedError)
  })

  Then(/^the current working directory is now "([^"]*)"$/, function (expectedCwd) {
    expect(path.basename(this.cwdAfterRun)).to.equal(expectedCwd)
  })

  Then(/^the test directory (?:now |still )contains a file "([^"]*)" with content:$/, function (fileName, expectedContent) {
    expect(fs.readFileSync(path.join(this.rootDir, 'tmp', fileName), 'utf8').trim()).to.equal(expectedContent.trim())
  })

  Then(/^the test workspace now contains a directory "([^"]*)"$/, function (fileName) {
    const stat = fs.statSync(path.join(this.rootDir, 'tmp', fileName))
    expect(stat.isDirectory()).to.be.true
  })

  Then(/^the test fails with:$/, function (table) {
    this.verifyFailure(table.rowsHash())
  })
})
