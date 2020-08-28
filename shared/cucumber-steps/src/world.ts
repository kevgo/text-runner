import { flatten } from "array-flatten"
import { assert } from "chai"
import { setWorldConstructor } from "cucumber"
import * as fs from "fs"
import * as glob from "glob"
import { createObservableProcess } from "observable-process"
import * as path from "path"
import stripAnsi = require("strip-ansi")
import * as helpers from "./helpers"

/**
 * World provides step implementations that run and test TextRunner
 * via its command-line interface
 */
function World() {
  this.execute = async function (params: { command: string; expectError: boolean; cwd: string }) {
    const args: any = {}
    args.cwd = params.cwd || this.rootDir
    if (this.debug) {
      args.env = {
        DEBUG: "*,-babel",
        PATH: process.env.PATH,
      }
    }
    const command = helpers.makeFullPath(params.command, process.platform)
    this.process = createObservableProcess(command, args)
    await this.process.waitForEnd()
    if (this.verbose) {
      this.output = this.process.output.fullText()
    }
    if (this.process.exitCode && !params.expectError) {
      console.log(this.process.output.fullText())
    }
  }

  this.verifyCallError = (expectedError: string) => {
    const output = stripAnsi(this.process.output.fullText())
    assert.include(output, expectedError)
    assert.equal(this.process.exitCode, 1)
  }

  this.verifyErrormessage = (expectedText: string) => {
    assert.include(stripAnsi(this.process.output.fullText()), expectedText)
  }

  this.verifyFailure = (table: any) => {
    const output = stripAnsi(this.process.output.fullText())
    let expectedHeader
    if (table.FILENAME && table.LINE) {
      expectedHeader = `${table.FILENAME}:${table.LINE}`
    } else if (table.FILENAME) {
      expectedHeader = `${table.FILENAME}`
    } else {
      expectedHeader = ""
    }
    if (table.MESSAGE) {
      expectedHeader += ` -- ${table.MESSAGE}`
    }
    assert.include(output, expectedHeader)
    assert.match(output, new RegExp(table["ERROR MESSAGE"]))
    assert.equal(this.process.exitCode, parseInt(table["EXIT CODE"], 10), "exit code")
  }

  this.verifyOutput = (table: any) => {
    let expectedText = ""
    if (table.OUTPUT) {
      expectedText += table.OUTPUT + "\n"
    }
    if (table.FILENAME) {
      expectedText += table.FILENAME
    }
    if (table.FILENAME && table.LINE) {
      expectedText += `:${table.LINE}`
    }
    if (table.FILENAME && table.MESSAGE) {
      expectedText += " -- "
    }
    if (table.MESSAGE) {
      expectedText += table.MESSAGE
    }
    if (table["ERROR MESSAGE"]) {
      expectedText += " -- " + table["ERROR MESSAGE"]
    }
    if (table["EXIT CODE"]) {
      throw new Error("Verifying normal output but table contains an exit code")
    }
    const actual = helpers.standardizePath(stripAnsi(this.process.output.fullText()))
    if (!actual.includes(expectedText)) {
      throw new Error(`Mismatching output!
Looking for: ${expectedText}
Actual content:
${actual}
`)
    }
  }

  this.verifyPrintedUsageInstructions = () => {
    assert.include(stripAnsi(this.process.output.fullText()), "COMMANDS")
  }

  this.verifyPrints = (expectedText: string) => {
    const output = stripAnsi(this.process.output.fullText().trim())
    if (!new RegExp(expectedText.trim()).test(output)) {
      throw new Error(`expected to find regex '${expectedText.trim()}' in '${output}'`)
    }
  }

  this.verifyPrintsNot = (text: string) => {
    const output = stripAnsi(this.process.output.fullText())
    if (new RegExp(text).test(output)) {
      throw new Error(`expected to not find regex '${text}' in '${output}'`)
    }
  }

  this.verifyRanConsoleCommand = (command: string) => {
    assert.include(stripAnsi(this.process.output.fullText()), `running console command: ${command}`)
  }

  this.verifyRanOnlyTests = (filenames: any) => {
    filenames = flatten(filenames)
    const standardizedOutput = this.process.output.fullText().replace(/\\/g, "/")

    // verify the given tests have run
    for (const filename of filenames) {
      assert.include(standardizedOutput, filename)
    }

    // verify all other tests have not run
    const filesShouldntRun = glob
      .sync(`${this.rootDir}/**`)
      .filter((file) => fs.statSync(file).isFile())
      .map((file) => path.relative(this.rootDir, file))
      .filter((file) => file)
      .map((file) => file.replace(/\\/g, "/"))
      .filter((file) => filenames.indexOf(file) === -1)
    for (const fileShouldntRun of filesShouldntRun) {
      assert.notInclude(standardizedOutput, fileShouldntRun)
    }
  }

  this.verifyTestsRun = (count: number) => {
    assert.include(stripAnsi(this.process.output.fullText()), ` ${count} activities`)
  }
}

setWorldConstructor(World)
