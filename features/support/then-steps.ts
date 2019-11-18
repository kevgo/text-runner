import * as assertNoDiff from "assert-no-diff"
import { assert } from "chai"
import { Then } from "cucumber"
import fs from "fs-extra"
import path from "path"
import psTreeR from "ps-tree"
import util from "util"

const psTree = util.promisify(psTreeR)

Then("I see usage instructions", function() {
  this.verifyPrintedUsageInstructions()
})

Then("it creates a directory {string}", async function(directoryPath) {
  await fs.stat(path.join(this.rootDir, directoryPath))
})

Then("it creates the file {string} with content:", async function(filename, expectedContent) {
  const actualContent = await fs.readFile(path.join(this.rootDir, filename), {
    encoding: "utf8"
  })
  assertNoDiff.trimmedLines(expectedContent, actualContent, "MISMATCHING FILE CONTENT!")
})

Then("it doesn't print:", function(expectedText) {
  this.verifyPrintsNot(expectedText)
})

Then("it prints:", function(expectedText) {
  this.verifyPrints(expectedText)
})

Then("it prints the error message:", function(expectedText) {
  this.verifyErrormessage(expectedText)
})

Then("it runs {int} test", function(count) {
  this.verifyTestsRun(count)
})

Then("it runs in a global temp directory", function() {
  assert.notInclude(this.process.output.fullText(), this.rootDir)
})

Then("it runs in the {string} directory", function(dirName) {
  assert.match(this.process.output.fullText(), new RegExp(`\\b${dirName}\\b`))
})

Then("it runs in the current working directory", function() {
  assert.match(this.process.output.fullText().trim(), new RegExp(`${this.rootDir}\\b`))
})

Then("it runs (only )the tests in {string}", function(filename) {
  this.verifyRanOnlyTests([filename])
})

Then("it runs only the tests in:", function(table) {
  this.verifyRanOnlyTests(table.raw())
})

Then("it runs the console command {string}", async function(command) {
  this.verifyRanConsoleCommand(command)
})

Then("it runs without errors", function() {
  // Nothing to do here
})

Then("it signals:", function(table) {
  this.verifyOutput(table.rowsHash())
})

Then("the call fails with the error:", function(expectedError) {
  this.verifyCallError(expectedError)
})

Then("the {string} directory is now deleted", async function(directoryPath) {
  try {
    await fs.stat(path.join(this.rootDir, directoryPath))
  } catch (e) {
    // we expect an exception here since the directory shouldn't exist
    return
  }
  throw new Error(`file '${directoryPath}' still exists`)
})

Then("the test directory now/still contains a file {string} with content:", async function(fileName, expectedContent) {
  const actualContent = await fs.readFile(path.join(this.rootDir, "tmp", fileName), "utf8")
  assert.equal(actualContent.trim(), expectedContent.trim())
})

Then("the test workspace now contains a directory {string}", async function(name) {
  const stat = await fs.stat(path.join(this.rootDir, "tmp", name))
  assert.isTrue(stat.isDirectory())
})

Then("the test fails with:", function(table) {
  this.verifyFailure(table.rowsHash())
})

Then("there are no child processes running", async function() {
  const children = await psTree(process.pid)
  assert.lengthOf(children, 1) // 1 is okay, it's the `ps` process used to determine the child processes
})

Then("there is no {string} folder", async function(name) {
  try {
    await fs.stat(path.join(this.rootDir, name))
  } catch (e) {
    return
  }
  throw new Error(`Expected folder ${name} to not be there, but it is`)
})
