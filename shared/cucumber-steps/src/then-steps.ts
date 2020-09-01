import * as assertNoDiff from "assert-no-diff"
import { assert } from "chai"
import { Then } from "cucumber"
import { promises as fs } from "fs"
import * as path from "path"
import * as psTreeR from "ps-tree"
import * as util from "util"
import stripAnsi = require("strip-ansi")
import * as textRunner from "text-runner"
import { TRWorld } from "./world"
import { standardizePath } from "./helpers/standardize-path"

const psTree = util.promisify(psTreeR)

interface ExecuteResultTable {
  filename?: string
  line?: number
  action?: string
  output?: string
  errorType?: string
  errorMessage?: string
}

Then("it executes these actions:", function (table) {
  assert.isUndefined(this.apiException)
  const apiResults = this.apiResults as textRunner.ExecuteResult
  const tableHashes = table.hashes()
  const want: ExecuteResultTable[] = []
  for (const line of tableHashes) {
    const result: ExecuteResultTable = {}
    if (line.FILENAME) {
      result.filename = line.FILENAME
    }
    if (line.LINE) {
      result.line = parseInt(line.LINE, 10)
    }
    if (line.ACTION) {
      result.action = line.ACTION
    }
    if (line.OUTPUT) {
      result.output = line.OUTPUT
    }
    want.push(result)
  }
  const have: ExecuteResultTable[] = []
  const wanted = want[0]
  for (const line of apiResults?.activityResults || []) {
    const result: ExecuteResultTable = {}
    if (wanted.filename) {
      result.filename = line.activity.file.platformified()
    }
    if (wanted.line) {
      result.line = line.activity.line
    }
    if (wanted.action) {
      result.action = line.activity.actionName
    }
    if (wanted.output) {
      result.output = line.output?.trim() || ""
    }
    have.push(result)
  }
  assert.deepEqual(have, want)
})

Then("it throws:", function (table) {
  if (!this.apiException) {
    throw new Error("no error thrown")
  }
  const tableHash = table.hashes()[0]
  const want: ExecuteResultTable = {
    errorType: tableHash["ERROR TYPE"],
    errorMessage: tableHash["ERROR MESSAGE"],
  }
  const have: ExecuteResultTable = {
    errorType: this.apiException.name,
    errorMessage: stripAnsi(this.apiException.message).trim().split("\n")[0],
  }
  if (tableHash.FILENAME) {
    want.filename = tableHash.FILENAME
    have.filename = this.apiException.filePath
  }
  if (tableHash.LINE) {
    want.line = parseInt(tableHash.LINE, 10)
    have.line = this.apiException.line
  }
  assert.deepEqual(have, want)
})

Then("the error provides the guidance:", function (expectedText) {
  if (!this.apiException) {
    throw new Error("no error thrown")
  }
  assert.equal(this.apiException.name, "UserError")
  assert.equal(expectedText.trim(), this.apiException.guidance.trim())
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
  const world = this as TRWorld
  const hash = table.rowsHash()
  let expectedText = ""
  if (hash.OUTPUT) {
    expectedText += hash.OUTPUT + "\n"
  }
  if (hash.FILENAME) {
    expectedText += hash.FILENAME
  }
  if (hash.FILENAME && hash.LINE) {
    expectedText += `:${hash.LINE}`
  }
  if (hash.FILENAME && hash.MESSAGE) {
    expectedText += " -- "
  }
  if (hash.MESSAGE) {
    expectedText += hash.MESSAGE
  }
  if (hash["ERROR MESSAGE"]) {
    expectedText += " -- " + hash["ERROR MESSAGE"]
  }
  if (hash["EXIT CODE"]) {
    throw new Error("Verifying normal output but table contains an exit code")
  }
  if (!world.process) {
    throw new Error("no process results found")
  }
  const actual = standardizePath(stripAnsi(world.process.output.fullText()))
  if (!actual.includes(expectedText)) {
    throw new Error(`Mismatching output!
Looking for: ${expectedText}
Actual content:
${actual}
`)
  }
})

Then("the call fails with the error:", function (expectedError) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(world.process.output.fullText())
  assert.include(output, expectedError)
  assert.equal(world.process.exitCode, 1)
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
  const world = this as TRWorld
  const hash = table.rowsHash()
  if (!world.process) {
    throw new Error("no process result found")
  }
  const output = stripAnsi(world.process.output.fullText())
  let expectedHeader
  if (hash.FILENAME && hash.LINE) {
    expectedHeader = `${hash.FILENAME}:${hash.LINE}`
  } else if (hash.FILENAME) {
    expectedHeader = `${hash.FILENAME}`
  } else {
    expectedHeader = ""
  }
  if (hash.MESSAGE) {
    expectedHeader += ` -- ${hash.MESSAGE}`
  }
  assert.include(output, expectedHeader)
  assert.match(output, new RegExp(hash["ERROR MESSAGE"]))
  assert.equal(world.process.exitCode, parseInt(hash["EXIT CODE"], 10))
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
