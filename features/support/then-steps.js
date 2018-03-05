// @flow

const { Then } = require('cucumber')
const { expect } = require('chai')
const fs = require('fs-extra')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')

Then('I see usage instructions', function () {
  this.verifyPrintedUsageInstructions()
})

Then('it creates a directory {string}', function (directoryPath) {
  fs.statSync(path.join(this.rootDir, directoryPath))
})

Then('it creates the file {string} with content:', function (
  filename,
  expectedContent
) {
  const actualContent = fs.readFileSync(path.join(this.rootDir, filename), {
    encoding: 'utf8'
  })
  jsdiffConsole(actualContent.trim(), expectedContent.trim())
})

Then("it doesn't print:", function (expectedText) {
  this.verifyPrintsNot(expectedText)
})

Then('it generates the file {string} with content:', function (
  filename,
  expectedContent
) {
  const actualContent = fs.readFileSync(
    path.join(this.rootDir, filename),
    'utf8'
  )
  jsdiffConsole(actualContent, expectedContent)
})

Then('it prints:', function (expectedText) {
  this.verifyPrints(expectedText)
})

Then('it prints the error message:', function (expectedText) {
  this.verifyErrormessage(expectedText)
})

Then('it runs {int} test', function (count) {
  this.verifyTestsRun(count)
})

Then('it runs in a global temp directory', function () {
  expect(this.output).to.not.include(this.rootDir)
})

Then('it runs in the {string} directory', function (dirName) {
  expect(this.output).to.match(new RegExp(`\\b${dirName}\\b`))
})

Then('it runs in the current working directory', function () {
  expect(this.output.trim()).to.match(new RegExp(`${this.rootDir}\\b`))
})

Then(/^it runs(?: only)? the tests in "([^"]*)"$/, function (filename) {
  this.verifyRanOnlyTests([filename])
})

Then('it runs only the tests in:', function (table) {
  this.verifyRanOnlyTests(table.raw())
})

Then('it runs the console command {string}', async function (command) {
  this.verifyRanConsoleCommand(command)
})

Then('it runs without errors', function () {})

Then('it signals:', function (table) {
  this.verifyOutput(table.rowsHash())
})

Then('the call fails with the error:', function (expectedError) {
  this.verifyCallError(expectedError)
})

Then('the current working directory is now {string}', function (expectedCwd) {
  expect(path.basename(this.cwdAfterRun)).to.equal(expectedCwd)
})

Then('the {string} directory is now deleted', function (directoryPath) {
  try {
    fs.statSync(path.join(this.rootDir, directoryPath))
    throw new Error(`file '${directoryPath}' still exists`)
  } catch (e) {}
})

Then(
  /^the test directory (?:now |still )contains a file "([^"]*)" with content:$/,
  function (fileName, expectedContent) {
    expect(
      fs.readFileSync(path.join(this.rootDir, 'tmp', fileName), 'utf8').trim()
    ).to.equal(expectedContent.trim())
  }
)

Then('the test workspace now contains a directory {string}', function (
  fileName
) {
  const stat = fs.statSync(path.join(this.rootDir, 'tmp', fileName))
  expect(stat.isDirectory()).to.be.true
})

Then('the test fails with:', function (table) {
  this.verifyFailure(table.rowsHash())
})
