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
import { verifyRanOnlyTestsCLI } from "./helpers/varify-ran-only-test-cli"

const psTree = util.promisify(psTreeR)

interface ExecuteResultTable {
  action?: string // standardized name of the action ("check-link")
  activity?: string // final name of the activity ("checking link http://foo.bar")
  errorMessage?: string // message of the UserError thrown
  errorType?: string // UserError or other error
  filename?: string
  line?: number
  output?: string // what the action printed via action.log()
  status?: textRunner.ActivityResultStatus
}

Then("it executes these actions:", function (table) {
  const world = this as TRWorld
  assert.isUndefined(world.apiException)
  const apiResults = world.apiResults as textRunner.ExecuteResult
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
    if (line.ACTIVITY) {
      result.activity = line.ACTIVITY
    }
    if (line.STATUS) {
      result.status = line.STATUS
    }
    if (line["ERROR TYPE"]) {
      result.errorType = line["ERROR TYPE"]
    }
    if (line["ERROR MESSAGE"]) {
      result.errorMessage = line["ERROR MESSAGE"]
    }
    want.push(result)
  }
  const have: ExecuteResultTable[] = []
  const wanted = want[0]
  for (const line of apiResults?.activityResults || []) {
    const result: ExecuteResultTable = {}
    if (wanted.filename) {
      result.filename = line.activity.file.unixified()
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
    if (wanted.activity) {
      result.activity = line.finalName
    }
    if (wanted.status) {
      result.status = line.status
    }
    if (wanted.errorType) {
      result.errorType = line.error?.name
    }
    if (wanted.errorMessage) {
      result.errorMessage = stripAnsi(line.error?.message || "")
    }
    have.push(result)
  }
  assert.deepEqual(have, want)
})

Then("it throws:", function (table) {
  const world = this as TRWorld
  if (!world.apiException) {
    throw new Error("no error thrown")
  }
  const tableHash = table.hashes()[0]
  const want: ExecuteResultTable = {
    errorType: tableHash["ERROR TYPE"],
    errorMessage: tableHash["ERROR MESSAGE"],
  }
  if (!world.apiException) {
    throw new Error("no apiException found")
  }
  const have: ExecuteResultTable = {
    errorType: world.apiException.name,
    errorMessage: stripAnsi(world.apiException.message).trim().split("\n")[0],
  }
  if (tableHash.FILENAME) {
    want.filename = tableHash.FILENAME
    have.filename = world.apiException.filePath
  }
  if (tableHash.LINE) {
    want.line = parseInt(tableHash.LINE, 10)
    have.line = world.apiException.line
  }
  assert.deepEqual(have, want)
})

Then("the error provides the guidance:", function (expectedText) {
  const world = this as TRWorld
  const failedActivities = world.apiResults.activityResults.map((res) => res.error)
  if (failedActivities.length === 0) {
    throw new Error("no failed activity encountered")
  }
  assert.equal(failedActivities[0]?.name, "UserError")
  const userError = failedActivities[0] as textRunner.UserError
  assert.equal(expectedText.trim(), userError.guidance.trim())
})

Then("the API exception provides the guidance:", function (expectedText) {
  const world = this as TRWorld
  if (!world.apiException) {
    throw new Error("no API exception found")
  }
  assert.equal(world.apiException.name, "UserError")
  const userError = world.apiException as textRunner.UserError
  assert.equal(expectedText.trim(), userError.guidance.trim())
})

Then("it prints usage instructions", function () {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(world.process.output.fullText()), "COMMANDS")
})

Then("it creates a directory {string}", async function (directoryPath) {
  const world = this as TRWorld
  await fs.stat(path.join(world.rootDir, directoryPath))
})

Then("it creates the file {string} with content:", async function (filename, expectedContent) {
  const world = this as TRWorld
  const actualContent = await fs.readFile(path.join(world.rootDir, filename), {
    encoding: "utf8",
  })
  assertNoDiff.trimmedLines(expectedContent, actualContent, "MISMATCHING FILE CONTENT!")
})

Then("it doesn't print:", function (expectedText) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(world.process.output.fullText())
  if (new RegExp(expectedText).test(output)) {
    throw new Error(`expected to not find regex '${expectedText}' in '${output}'`)
  }
})

Then("it prints:", function (expectedText) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(world.process.output.fullText().trim())
  if (!new RegExp(expectedText.trim()).test(output)) {
    throw new Error(`expected to find regex '${expectedText.trim()}' in '${output}'`)
  }
})

Then("it runs {int} test", function (count) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(world.process.output.fullText()), ` ${count} activities`)
})

Then("it runs in a global temp directory", function () {
  const world = this as TRWorld
  if (!world.apiResults) {
    throw new Error("no API results found")
  }
  assert.notInclude(world.apiResults.activityResults[0].output, world.rootDir)
})

Then("it runs in the local {string} directory", function (dirName) {
  const world = this as TRWorld
  if (!world.apiResults) {
    throw new Error("no API results found")
  }
  const have = world.apiResults.activityResults[0].output.trim()
  const want = path.join(world.rootDir, dirName)
  assert.equal(have, want)
})

Then("it runs in the current working directory", function () {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no CLI process found")
  }
  assert.match(world.process.output.fullText().trim(), new RegExp(`${world.rootDir}\\b`))
})

Then("it runs (only )the tests in {string}", function (filename) {
  const world = this as TRWorld
  verifyRanOnlyTestsCLI([filename], world)
})

Then("it runs only the tests in:", function (table) {
  const world = this as TRWorld
  verifyRanOnlyTestsCLI(table.raw(), world)
})

Then("it runs the console command {string}", async function (command) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(world.process.output.fullText()), `running console command: ${command}`)
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
  const world = this as TRWorld
  try {
    await fs.stat(path.join(world.rootDir, directoryPath))
  } catch (e) {
    // we expect an exception here since the directory shouldn't exist
    return
  }
  throw new Error(`file '${directoryPath}' still exists`)
})

Then("the test directory now/still contains a file {string} with content:", async function (fileName, expectedContent) {
  const world = this as TRWorld
  const actualContent = await fs.readFile(path.join(world.rootDir, "tmp", fileName), "utf8")
  assert.equal(actualContent.trim(), expectedContent.trim())
})

Then("the test workspace now contains a directory {string}", async function (name) {
  const world = this as TRWorld
  const stat = await fs.stat(path.join(world.rootDir, "tmp", name))
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
  const world = this as TRWorld
  try {
    await fs.stat(path.join(world.rootDir, name))
  } catch (e) {
    return
  }
  throw new Error(`Expected folder ${name} to not be there, but it is`)
})
