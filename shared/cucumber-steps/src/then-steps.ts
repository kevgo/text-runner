import * as assertNoDiff from "assert-no-diff"
import { assert } from "chai"
import { Then } from "cucumber"
import { promises as fs } from "fs"
import * as path from "path"
import * as psTreeR from "ps-tree"
import * as util from "util"
import stripAnsi = require("strip-ansi")
import * as textRunner from "text-runner"

const psTree = util.promisify(psTreeR)

Then("it executes these actions:", function (table) {
  const apiResults = this.apiResults as textRunner.ExecuteResult
  const tableHashes = table.hashes()
  const want = tableHashes.map((line: any) => {
    return {
      filename: line.FILENAME,
      line: parseInt(line.LINE, 10),
      action: line.ACTION,
      output: line.OUTPUT || "",
      error: line["ERROR MESSAGE"] || "",
    }
  })
  const have = apiResults.activityResults.map((result) => {
    return {
      filename: result.activity.file.platformified(),
      line: result.activity.line,
      action: result.activity.actionName,
      output: result.output.trim() || "",
      error: stripAnsi(result.error?.message || "").split("\n")[0],
    }
  })
  assert.deepEqual(have, want)

  // here the three items above match, check the output
  if (tableHashes.OUTPUT) {
    throw new Error("IMPLEMENT OUTPUT CHECKING")
  }
})

Then("it executes only this action:", function (table) {
  const results = this.apiResults as textRunner.ExecuteResult
  if (results.activityResults.length !== 1) {
    console.log(`expected 1 action but executed ${results.activityResults.length}:`)
    for (const result of results.activityResults) {
      console.log(`- ${result.activity.file.platformified()}:${result.activity.line} - ${result.activity.actionName}`)
    }
    throw new Error("unexpected actions")
  }
  const wants = table.hashes()
  for (let i = 0; i < wants.length; i++) {
    if (
      results.activityResults[i].activity.file.platformified() !== wants[i].FILENAME ||
      results.activityResults[i].activity.line !== parseInt(wants[i].LINE, 10) ||
      results.activityResults[i].activity.actionName !== wants[i].ACTION
    ) {
      break
    }
    return
  }
  // here we didn't find a match
  console.log(`Text-Runner executed these ${results.activityResults.length} activities:`)
  for (const result of results.activityResults) {
    console.log(`- ${result.activity.file.platformified()}:${result.activity.line} - ${result.activity.actionName}`)
  }
  throw new Error("Expected activity not executed")
})

Then("it prints usage instructions", function () {
  this.verifyPrintedUsageInstructions()
})

Then("it creates a directory {string}", async function (directoryPath) {
  await fs.stat(path.join(this.rootDir, directoryPath))
})

Then("it creates the file {string} with content:", async function (filename, expectedContent) {
  const actualContent = await fs.readFile(path.join(this.rootDir, filename), {
    encoding: "utf8",
  })
  assertNoDiff.trimmedLines(expectedContent, actualContent, "MISMATCHING FILE CONTENT!")
})

Then("it doesn't print:", function (expectedText) {
  this.verifyPrintsNot(expectedText)
})

Then("it prints:", function (expectedText) {
  this.verifyPrints(expectedText)
})

Then("it prints the error message:", function (expectedText) {
  this.verifyErrormessage(expectedText)
})

Then("it runs {int} test", function (count) {
  this.verifyTestsRun(count)
})

Then("it runs in a global temp directory", function () {
  assert.notInclude(this.process.output.fullText(), this.rootDir)
})

Then("it runs in the {string} directory", function (dirName) {
  assert.match(this.process.output.fullText(), new RegExp(`\\b${dirName}\\b`))
})

Then("it runs in the current working directory", function () {
  assert.match(this.process.output.fullText().trim(), new RegExp(`${this.rootDir}\\b`))
})

Then("it runs (only )the tests in {string}", function (filename) {
  this.verifyRanOnlyTests([filename])
})

Then("it runs only the tests in:", function (table) {
  this.verifyRanOnlyTests(table.raw())
})

Then("it runs the console command {string}", async function (command) {
  this.verifyRanConsoleCommand(command)
})

Then("it runs without errors", function () {
  // Nothing to do here
})

Then("it signals:", function (table) {
  this.verifyOutput(table.rowsHash())
})

Then("it provides the error message:", function (want) {
  const results = this.apiResults as textRunner.ExecuteResult
  for (const activityResult of results.activityResults) {
    if (activityResult.error?.message?.includes(want)) {
      return
    }
  }
  console.log("Didn't find error message:", want)
  console.log(`I found ${results.errorCount} errors`)
  for (const activityResult of results.activityResults) {
    if (activityResult.error) {
      console.log(`- ${activityResult.error.message}`)
    }
  }
})

Then("it throws a user error with the message:", function (message: string) {
  assert.typeOf(this.apiException, "Error")
  assert.equal(this.apiException.message, message)
})

Then("the call fails with the error:", function (expectedError) {
  this.verifyCallError(expectedError)
})

Then("the execution fails at:", function (table) {
  const results = this.apiResults as textRunner.ExecuteResult
  const tableHash = table.rowsHash()
  const want = {
    filename: tableHash.FILENAME,
    line: parseInt(tableHash.LINE, 10),
    errorMessage: tableHash["ERROR MESSAGE"],
  }
  for (const result of results.activityResults) {
    const error = stripAnsi(result.error?.message || "")
    if (
      result.activity.file.platformified() !== want.filename ||
      result.activity.line !== want.line ||
      !error.includes(want.errorMessage)
    ) {
      continue
    }
    // here the three items above match, check the output
    if (table.OUTPUT) {
      assert.include(result.output, table.OUTPUT)
    }
    return
  }
  // here we didn't find a match
  console.log(`Text-Runner executed these ${results.activityResults.length} activities:`)
  for (const result of results.activityResults) {
    console.log(`- ${result.activity.file.platformified()}:${result.activity.line}: ${result.error?.message}`)
  }
  throw new Error("Expected error not encountered")
})

Then("the {string} directory is now deleted", async function (directoryPath) {
  try {
    await fs.stat(path.join(this.rootDir, directoryPath))
  } catch (e) {
    // we expect an exception here since the directory shouldn't exist
    return
  }
  throw new Error(`file '${directoryPath}' still exists`)
})

Then("the test directory now/still contains a file {string} with content:", async function (fileName, expectedContent) {
  const actualContent = await fs.readFile(path.join(this.rootDir, "tmp", fileName), "utf8")
  assert.equal(actualContent.trim(), expectedContent.trim())
})

Then("the test workspace now contains a directory {string}", async function (name) {
  const stat = await fs.stat(path.join(this.rootDir, "tmp", name))
  assert.isTrue(stat.isDirectory())
})

Then("the test fails with:", function (table) {
  this.verifyFailure(table.rowsHash())
})

Then("there are no child processes running", async function () {
  const children = await psTree(process.pid)
  assert.lengthOf(children, 1) // 1 is okay, it's the `ps` process used to determine the child processes
})

Then("there is no {string} folder", async function (name) {
  try {
    await fs.stat(path.join(this.rootDir, name))
  } catch (e) {
    return
  }
  throw new Error(`Expected folder ${name} to not be there, but it is`)
})
