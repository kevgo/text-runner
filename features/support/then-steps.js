// @flow

const {expect} = require('chai')
const fs = require('fs-extra')
const glob = require('glob')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

module.exports = function () {
  this.Then(/^I see usage instructions$/, function () {
    this.verifyPrintedUsageInstructions()
  })

  this.Then(/^it creates a directory "([^"]*)"$/, function (directoryPath) {
    fs.statSync(path.join(this.rootDir.name, directoryPath))
  })

  this.Then(/^it creates the file "([^"]*)" with content:$/, function (filename, expectedContent) {
    const actualContent = fs.readFileSync(path.join(this.rootDir.name, filename),
                                          {encoding: 'utf8'})
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
  })

  this.Then(/^it prints:$/, function (expectedText) {
    this.verifyPrints(expectedText)
  })

  this.Then(/^it prints the error message:$/, function (expectedText) {
    this.verifyErrormessage(expectedText)
  })

  this.Then(/^it runs (\d+) test$/, function (count) {
    this.verifyTestsRun(count)
  })

  this.Then(/^it runs in a global temp directory$/, function () {
    expect(this.output).to.not.include(this.rootDir.name)
  })

  this.Then(/^it runs in the "([^"]+)" directory$/, function (dirName) {
    expect(this.output).to.match(new RegExp(`${dirName}\\b`))
  })

  this.Then(/^it runs in the current working directory$/, function () {
    expect(this.output).to.match(new RegExp(`${this.rootDir.name}\\b`))
  })

  this.Then(/^it runs(?: only)? the tests in "([^"]*)"$/, function (filename) {
    this.verifyRanOnlyTests([filename])
  })

  this.Then(/^it runs only the tests in:$/, function (table) {
    this.verifyRanOnlyTests(table.raw())
  })

  this.Then(/^it runs the console command "([^"]*)"$/, function (command, done) {
    this.verifyRanConsoleCommand(command, done)
  })

  this.Then(/^it runs without errors$/, function () {
  })

  this.Then(/^it signals:$/, function (table) {
    this.verifyOutput(table.rowsHash())
  })

  this.Then(/^the call fails with the error:$/, function (expectedError) {
    this.verifyCallError(expectedError)
  })

  this.Then(/^the current working directory is now "([^"]*)"$/, function (expectedCwd) {
    expect(path.basename(this.cwdAfterRun)).to.equal(expectedCwd)
  })

  this.Then(/^the test directory (?:now |still )contains a file "([^"]*)" with content:$/, function (fileName, expectedContent) {
    expect(fs.readFileSync(path.join(this.rootDir.name, 'tmp', fileName), 'utf8').trim()).to.equal(expectedContent.trim())
  })

  this.Then(/^the test workspace now contains a directory "([^"]*)"$/, function (fileName) {
    const stat = fs.statSync(path.join(this.rootDir.name, 'tmp', fileName))
    expect(stat.isDirectory()).to.be.true
  })

  this.Then(/^the test fails with:$/, function (table) {
    this.verifyFailure(table.rowsHash())
  })
}
