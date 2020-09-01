import { World } from "cucumber"
import { flatten } from "array-flatten"
import { assert } from "chai"
import { setWorldConstructor } from "cucumber"
import * as fs from "fs"
import * as glob from "glob"
import * as path from "path"
import stripAnsi = require("strip-ansi")
import { standardizePath } from "./helpers/standardize-path"
import { ObservableProcess } from "observable-process"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** the currently running subshell process */
  process: ObservableProcess | undefined
  rootDir: string
  debug: boolean
  verbose: boolean
}

/**
 * World provides step implementations that run and test TextRunner
 * via its command-line interface
 */
function World() {
  this.verifyErrormessage = (expectedText: string) => {
    assert.include(stripAnsi(this.process.output.fullText()), expectedText)
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
    const actual = standardizePath(stripAnsi(this.process.output.fullText()))
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
