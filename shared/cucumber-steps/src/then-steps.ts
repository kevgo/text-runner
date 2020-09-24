import * as assertNoDiff from "assert-no-diff"
import { assert } from "chai"
import { Then } from "cucumber"
import { promises as fs } from "fs"
import * as path from "path"
import * as psTreeR from "ps-tree"
import * as util from "util"
import stripAnsi = require("strip-ansi")
import * as textRunner from "text-runner-core"
import { TRWorld } from "./world"
import * as helpers from "./helpers"

const psTree = util.promisify(psTreeR)

export interface ExecuteResultLine {
  action?: string // standardized name of the action ("check-link")
  activity?: string // final name of the activity ("checking link http://foo.bar")
  errorMessage?: string // message of the UserError thrown
  errorType?: string // UserError or other error
  filename?: string
  line?: number
  output?: string // what the action printed via action.log()
  status?: "success" | "failed" | "skipped" | "warning"
}

Then("it executes {int} test", function (count) {
  const world = this as TRWorld
  if (!world.apiResults) {
    throw new Error("no API results found")
  }
  assert.equal(world.apiResults.length, count)
})

Then("it executes in the local {string} directory", function (dirName) {
  const world = this as TRWorld
  if (!world.apiResults) {
    throw new Error("no API results found")
  }
  const have = world.apiResults[0].output?.trim()
  const want = path.join(world.rootDir, dirName)
  assert.equal(have, want)
})

Then("it executes these actions:", function (table) {
  const world = this as TRWorld
  assert.isUndefined(world.apiException)
  const tableHashes = table.hashes()
  const want: ExecuteResultLine[] = []
  for (const line of tableHashes) {
    const result: ExecuteResultLine = {}
    if (line.FILENAME != null) {
      result.filename = line.FILENAME
    }
    if (line.LINE != null) {
      result.line = parseInt(line.LINE, 10)
    }
    if (line.ACTION != null) {
      result.action = line.ACTION
    }
    if (line.OUTPUT != null) {
      result.output = line.OUTPUT
    }
    if (line.ACTIVITY != null) {
      result.activity = line.ACTIVITY
    }
    if (line.STATUS != null) {
      result.status = line.STATUS
    }
    if (line["ERROR TYPE"] != null) {
      result.errorType = line["ERROR TYPE"] || ""
    }
    if (line["ERROR MESSAGE"] != null) {
      result.errorMessage = line["ERROR MESSAGE"]
    }
    want.push(result)
  }
  let have: ExecuteResultLine[] = []
  const wanted = want[0]
  for (const activityResult of world.apiResults) {
    const result: ExecuteResultLine = {}
    if (wanted.filename != null) {
      result.filename = activityResult.activity?.file.unixified()
    }
    if (wanted.line != null) {
      result.line = activityResult.activity?.line
    }
    if (wanted.action != null) {
      result.action = activityResult.activity?.actionName
    }
    if (wanted.output != null) {
      result.output = activityResult.output?.trim() || ""
    }
    if (wanted.activity != null) {
      result.activity = stripAnsi(activityResult.finalName || "")
      if (process.platform === "win32") {
        result.activity = result.activity.replace(/\\/g, "/")
      }
    }
    if (wanted.status != null) {
      result.status = activityResult.status
    }
    if (wanted.errorType != null) {
      result.errorType = activityResult.error?.name || ""
    }
    if (wanted.errorMessage != null) {
      result.errorMessage = stripAnsi(activityResult.error?.message || "")
    }
    have.push(result)
  }
  have = have.sort(helpers.compareExecuteResultLine)
  assert.deepEqual(have, want)
})

Then("it executes with this warning:", function (warning: string) {
  const world = this as TRWorld
  assert.isUndefined(world.apiException)
  assert.equal(world.apiResults.length, 1, "activity results")
  assert.equal(world.apiResults[0].message, warning)
})

Then("it throws:", function (table) {
  const world = this as TRWorld
  if (!world.apiException) {
    throw new Error("no error thrown")
  }
  const tableHash = table.hashes()[0]
  const want: ExecuteResultLine = {
    errorType: tableHash["ERROR TYPE"],
    errorMessage: tableHash["ERROR MESSAGE"],
  }
  if (!world.apiException) {
    throw new Error("no apiException found")
  }
  const have: ExecuteResultLine = {
    errorType: world.apiException.name,
    errorMessage: stripAnsi(world.apiException.message).trim().split("\n")[0],
  }
  if (tableHash.FILENAME) {
    want.filename = tableHash.FILENAME
    have.filename = world.apiException.file?.unixified()
  }
  if (tableHash.LINE) {
    want.line = parseInt(tableHash.LINE, 10)
    have.line = world.apiException.line
  }
  assert.deepEqual(have, want)
})

Then("the error provides the guidance:", function (expectedText) {
  const world = this as TRWorld
  const errors = world.apiResults.map(res => res.error).filter(e => e)
  if (errors.length === 0) {
    throw new Error("no failed activity encountered")
  }
  assert.equal(errors[0]?.name, "UserError")
  const userError = errors[0] as textRunner.UserError
  assert.equal(stripAnsi(userError.guidance.trim()), expectedText.trim())
})

Then("the API exception provides the guidance:", function (expectedText) {
  const world = this as TRWorld
  if (!world.apiException) {
    throw new Error("no API exception found")
  }
  assert.equal(world.apiException.name, "UserError")
  const userError = world.apiException as textRunner.UserError
  assert.equal(userError.guidance.trim(), expectedText.trim())
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
  let output = stripAnsi(world.process.output.fullText().trim())
  if (process.platform === "win32") {
    output = output.replace(/\\/g, "/")
  }
  if (!new RegExp(expectedText.trim()).test(output)) {
    throw new Error(`expected to find regex '${expectedText.trim()}' in '${output}'`)
  }
})

Then("it prints the text:", function (expectedText) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(world.process.output.fullText()).trim()
  assert.equal(output, expectedText.trim())
})

Then("it runs {int} test", function (count) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(world.process.output.fullText()), ` ${count} activities`)
})

Then("it executes in a global temp directory", function () {
  const world = this as TRWorld
  assert.notInclude(world.apiResults[0].output, world.rootDir)
})

Then("it runs in a global temp directory", function () {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no CLI process found")
  }
  assert.notInclude(world.process.output.fullText(), world.rootDir)
})

Then("it runs in the local {string} directory", function (dirName) {
  const world = this as TRWorld
  if (!world.process) {
    throw new Error("no process found")
  }
  const have = world.process.output.fullText()
  const want = path.join(world.rootDir, dirName)
  assert.include(have, want)
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
  helpers.verifyRanOnlyTestsCLI([filename], world)
})

Then("it runs only the tests in:", function (table) {
  const world = this as TRWorld
  helpers.verifyRanOnlyTestsCLI(table.raw(), world)
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
  const actual = helpers.standardizePath(stripAnsi(world.process.output.fullText()))
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
