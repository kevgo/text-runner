import { Then } from "@cucumber/cucumber"
import * as cucumber from "@cucumber/cucumber"
import * as assertNoDiff from "assert-no-diff"
import { assert } from "chai"
import { promises as fs } from "fs"
import psTreeR from "ps-tree"
import stripAnsi from "strip-ansi"
import * as textRunner from "text-runner-core"
import * as util from "util"

import * as helpers from "./helpers/index.js"
import * as workspace from "./helpers/workspace.js"
import { TRWorld } from "./world.js"

const psTree = util.promisify(psTreeR)

type ResultStatus = "success" | "failed" | "skipped" | "warning"
export interface ExecuteResultLine {
  action?: string // standardized name of the action ("check-link")
  activity?: string // final name of the activity ("checking link http://foo.bar")
  errorMessage?: string // message of the UserError thrown
  errorType?: string // UserError or other error
  filename?: string
  guidance?: string // guidance provided together with the error
  line?: number
  message?: string
  output?: string // what the action printed via action.log()
  status?: ResultStatus
}
Then("explode", function () {
  throw new Error("BOOM")
})

Then("it executes {int} test", function (this: TRWorld, count: number) {
  if (!this.apiResults) {
    throw new Error("no API results found")
  }
  assert.equal(this.apiResults.length, count)
})

Then("it executes in the local {string} directory", function (this: TRWorld, dirName: string) {
  if (!this.apiResults) {
    throw new Error("no API results found")
  }
  const have = this.apiResults[0].output?.trim()
  const want = workspace.absPath.joinStr(dirName)
  assert.equal(have, want)
})

Then("it emits these events:", function (this: TRWorld, table: cucumber.DataTable) {
  if (this.apiException) {
    console.log(this.apiException)
    assert.fail("unexpected exception during API call")
  }
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
    result.status = (line.STATUS as ResultStatus) ?? "success"
    if (line.MESSAGE != null) {
      result.message = line.MESSAGE
    }
    if (line["ERROR TYPE"] != null) {
      result.errorType = line["ERROR TYPE"]
    }
    result.errorMessage = line["ERROR MESSAGE"] || ""
    if (line.GUIDANCE != null || line["ERROR TYPE"] === "UserError") {
      const guidance: string = line["GUIDANCE"] || ""
      result.guidance = guidance.trim()
    }
    want.push(result)
  }
  let have: ExecuteResultLine[] = []
  const wanted = want[0]
  for (const activityResult of this.apiResults) {
    const result: ExecuteResultLine = {}
    if (wanted.filename != null) {
      result.filename = activityResult.activity?.location.file.unixified()
    }
    if (wanted.line != null) {
      result.line = activityResult.activity?.location.line
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
        result.activity = result.activity?.replace(/\\/g, "/")
      }
    }
    if (wanted.message != null) {
      result.message = activityResult.message
    }
    if (activityResult.message != null) {
      result.message = activityResult.message
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
    if (wanted.guidance != null) {
      result.guidance = stripAnsi((activityResult.error as textRunner.UserError)?.guidance?.trim() || "")
    }
    have.push(result)
  }
  have = have.sort(helpers.compareExecuteResultLine)
  assert.deepEqual(have, want)
})

Then("it throws:", function (this: TRWorld, table: cucumber.DataTable) {
  if (!this.apiException) {
    throw new Error("no error thrown")
  }
  const tableHash = table.hashes()[0]
  const want: ExecuteResultLine = {
    errorType: tableHash["ERROR TYPE"],
    errorMessage: tableHash["ERROR MESSAGE"],
  }
  if (!this.apiException) {
    throw new Error("no apiException found")
  }
  const have: ExecuteResultLine = {
    errorType: this.apiException.name,
    errorMessage: stripAnsi(this.apiException.message).trim().split("\n")[0],
  }
  if (tableHash.FILENAME) {
    want.filename = tableHash.FILENAME
    have.filename = this.apiException.location?.file.unixified()
  }
  if (tableHash.LINE) {
    want.line = parseInt(tableHash.LINE, 10)
    have.line = this.apiException.location?.line
  }
  assert.deepEqual(have, want)
})

Then("the error provides the guidance:", function (this: TRWorld, expectedText: string) {
  const errors = this.apiResults?.errors() || []
  if (errors.length === 0) {
    throw new Error("no failed activity encountered")
  }
  assert.equal(errors[0].name, "UserError")
  const userError = errors[0] as textRunner.UserError
  assert.equal(stripAnsi(userError.guidance.trim()), expectedText.trim())
})

Then("the API exception provides the guidance:", function (this: TRWorld, expectedText: string) {
  if (!this.apiException) {
    throw new Error("no API exception found")
  }
  assert.equal(this.apiException.name, "UserError")
  const userError = this.apiException
  assert.equal(userError.guidance.trim(), expectedText.trim())
})

Then("it creates a directory {string}", async function (this: TRWorld, directoryPath: string) {
  await fs.stat(workspace.absPath.joinStr(directoryPath))
})

Then(
  "it creates the file {string} with content:",
  async function (this: TRWorld, filename: string, expectedContent: string) {
    const actualContent = await fs.readFile(workspace.absPath.joinStr(filename), {
      encoding: "utf8",
    })
    assertNoDiff.trimmedLines(expectedContent, actualContent, "MISMATCHING FILE CONTENT!")
  },
)

Then("it doesn't print:", function (this: TRWorld, expectedText: string) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(this.finishedProcess.combinedText)
  if (new RegExp(expectedText).test(output)) {
    throw new Error(`expected to not find regex '${expectedText}' in '${output}'`)
  }
})

Then("it prints:", function (this: TRWorld, expectedText: string) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  let output = stripAnsi(this.finishedProcess.combinedText.trim())
  if (process.platform === "win32") {
    output = output.trim().replace(/\\/g, "/")
  }
  const escapedText = expectedText
    .trim()
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\//g, "\\/")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
  if (!new RegExp(escapedText, "ms").test(output)) {
    throw new Error(`expected to find regex '${expectedText.trim()}' in '${output}'`)
  }
})

Then("it prints the text:", function (this: TRWorld, expectedText: string) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(this.finishedProcess.combinedText).trim()
  assert.equal(output, expectedText.trim())
})

Then("it runs {int} test", function (this: TRWorld, count: number) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(this.finishedProcess.combinedText), ` ${count} activities`)
})

Then("it executes in a global temp directory", function (this: TRWorld) {
  assert.notInclude(this.apiResults[0].output, workspace.absPath.unixified())
})

Then("it executes in the global {string} temp directory", function (this: TRWorld, dirName: string) {
  assert.notInclude(this.apiResults[0].output, workspace.absPath.joinStr(dirName))
})

Then("it runs in a global temp directory", function (this: TRWorld) {
  if (!this.finishedProcess) {
    throw new Error("no CLI process found")
  }
  assert.notInclude(this.finishedProcess.combinedText, workspace.absPath.unixified())
})

Then("it runs in the global {string} temp directory", function (this: TRWorld, dirName: string) {
  if (!this.finishedProcess) {
    throw new Error("no CLI process found")
  }
  assert.notInclude(this.finishedProcess.combinedText, workspace.absPath.joinStr(dirName))
})

Then("it runs in the local {string} directory", function (this: TRWorld, dirName: string) {
  if (!this.finishedProcess) {
    throw new Error("no process found")
  }
  const have = this.finishedProcess.combinedText
  const want = workspace.absPath.joinStr(dirName)
  assert.include(have, want)
})

Then("it runs in the current working directory", function (this: TRWorld) {
  if (!this.finishedProcess) {
    throw new Error("no CLI process found")
  }
  assert.match(this.finishedProcess.combinedText.trim(), new RegExp(`${workspace.absPath}\\b`))
})

Then("it runs (only )the tests in {string}", function (this: TRWorld, filename: string) {
  helpers.verifyRanOnlyTestsCLI([filename], this)
})

Then("it runs only the tests in:", function (this: TRWorld, table: cucumber.DataTable) {
  helpers.verifyRanOnlyTestsCLI(table.raw(), this)
})

Then("it runs the console command {string}", function (this: TRWorld, command: string) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  assert.include(stripAnsi(this.finishedProcess.combinedText), `running console command: ${command}`)
})

Then("it runs without errors", function (this: TRWorld) {
  // Nothing to do here
})

Then("it signals:", function (this: TRWorld, table: cucumber.DataTable) {
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
  if (!this.finishedProcess) {
    throw new Error("no process results found")
  }
  const actual = helpers.standardizePath(stripAnsi(this.finishedProcess.combinedText))
  if (!actual.includes(expectedText)) {
    throw new Error(`Mismatching output!
Looking for: ${expectedText}
Actual content:
${actual}
`)
  }
})

Then("the call fails with the error:", function (this: TRWorld, expectedError: string) {
  if (!this.finishedProcess) {
    throw new Error("no process output found")
  }
  const output = stripAnsi(this.finishedProcess.combinedText)
  assert.include(output, expectedError)
  assert.equal(this.finishedProcess.exitCode, 1)
})

Then("the {string} directory is now deleted", async function (this: TRWorld, directoryPath: string) {
  try {
    await fs.stat(workspace.absPath.joinStr(directoryPath))
  } catch (e) {
    // we expect an exception here since the directory shouldn't exist
    return
  }
  throw new Error(`file '${directoryPath}' still exists`)
})

Then(
  "the workspace now/still contains a file {string} with content:",
  async function (this: TRWorld, fileName: string, expectedContent: string) {
    const actualContent = await fs.readFile(workspace.absPath.joinStr("tmp", fileName), "utf8")
    assert.equal(actualContent.trim(), expectedContent.trim())
  },
)

Then("the test workspace now contains a directory {string}", async function (this: TRWorld, name: string) {
  const stat = await fs.stat(workspace.absPath.joinStr("tmp", name))
  assert.isTrue(stat.isDirectory())
})

Then("the test fails with:", function (this: TRWorld, table: cucumber.DataTable) {
  const hash = table.rowsHash()
  if (!this.finishedProcess) {
    throw new Error("no process result found")
  }
  const output = stripAnsi(this.finishedProcess.combinedText)
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
  assert.equal(this.finishedProcess.exitCode, parseInt(hash["EXIT CODE"], 10))
})

Then("there are no child processes running", async function (this: TRWorld) {
  const children = await psTree(process.pid)
  assert.lengthOf(children, 1) // 1 is okay, it's the `ps` process used to determine the child processes
})

Then("there is no {string} folder", async function (this: TRWorld, name: string) {
  try {
    await fs.stat(workspace.absPath.joinStr(name))
  } catch (e) {
    return
  }
  throw new Error(`Expected folder ${name} to not be there, but it is`)
})
