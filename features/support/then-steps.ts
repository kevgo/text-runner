import { expect } from 'chai'
import { Then } from 'cucumber'
import fs from 'fs-extra'
import jsdiffConsole from 'jsdiff-console'
import path from 'path'
import psTreeR from 'ps-tree'
import util from 'util'

const psTree = util.promisify(psTreeR)

Then('I see usage instructions', function() {
  this.verifyPrintedUsageInstructions()
})

Then('it creates a directory {string}', async function(directoryPath) {
  await fs.stat(path.join(this.rootDir, directoryPath))
})

Then('it creates the file {string} with content:', async function(
  filename,
  expectedContent
) {
  const actualContent = await fs.readFile(path.join(this.rootDir, filename), {
    encoding: 'utf8'
  })
  try {
    jsdiffConsole(expectedContent.trim(), actualContent.trim())
  } catch (e) {
    console.log('MISMATCHING FILE CONTENT!')
    console.log(e)
    throw new Error()
  }
})

Then("it doesn't print:", function(expectedText) {
  this.verifyPrintsNot(expectedText)
})

Then('it prints:', function(expectedText) {
  this.verifyPrints(expectedText)
})

Then('it prints the error message:', function(expectedText) {
  this.verifyErrormessage(expectedText)
})

Then('it runs {int} test', function(count) {
  this.verifyTestsRun(count)
})

Then('it runs in a global temp directory', function() {
  expect(this.output).to.not.include(this.rootDir)
})

Then('it runs in the {string} directory', function(dirName) {
  expect(this.output).to.match(new RegExp(`\\b${dirName}\\b`))
})

Then('it runs in the current working directory', function() {
  expect(this.output.trim()).to.match(new RegExp(`${this.rootDir}\\b`))
})

Then('it runs (only )the tests in {string}', function(filename) {
  this.verifyRanOnlyTests([filename])
})

Then('it runs only the tests in:', function(table) {
  this.verifyRanOnlyTests(table.raw())
})

Then('it runs the console command {string}', async function(command) {
  this.verifyRanConsoleCommand(command)
})

Then('it runs without errors', function() {
  // Nothing to do here
})

Then('it signals:', function(table) {
  this.verifyOutput(table.rowsHash())
})

Then('the call fails with the error:', function(expectedError) {
  this.verifyCallError(expectedError)
})

Then('the {string} directory is now deleted', async function(directoryPath) {
  try {
    await fs.stat(path.join(this.rootDir, directoryPath))
  } catch (e) {
    // we expect an exception here since the directory shouldn't exist
    return
  }
  throw new Error(`file '${directoryPath}' still exists`)
})

Then(
  'the test directory now/still contains a file {string} with content:',
  async function(fileName, expectedContent) {
    const actualContent = await fs.readFile(
      path.join(this.rootDir, 'tmp', fileName),
      'utf8'
    )
    expect(actualContent.trim()).to.equal(expectedContent.trim())
  }
)

Then('the test workspace now contains a directory {string}', async function(
  name
) {
  const stat = await fs.stat(path.join(this.rootDir, 'tmp', name))
  expect(stat.isDirectory()).to.be.true
})

Then('the test fails with:', function(table) {
  this.verifyFailure(table.rowsHash())
})

Then('there are no child processes running', async function() {
  const children = await psTree(process.pid)
  expect(children).to.have.length(1) // 1 is okay, it's the `ps` process used to determine the child processes
})

Then('there is no {string} folder', async function(name) {
  try {
    await fs.stat(path.join(this.rootDir, name))
  } catch (e) {
    return
  }
  throw new Error(`Expected folder ${name} to not be there, but it is`)
})
