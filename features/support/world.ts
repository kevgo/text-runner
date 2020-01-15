import { flatten } from "array-flatten"
import { assert } from "chai"
import { setWorldConstructor } from "cucumber"
import fs from "fs-extra"
import glob from "glob"
import { createObservableProcess } from "observable-process"
import path from "path"
import stripAnsi from "strip-ansi"
import { v4 as uuid } from "uuid"

/**
 * World provides step implementations that run and test TextRunner
 * via its command-line interface
 */
function World() {
  this.execute = async function(params: { command: string; expectError: boolean }) {
    const args: any = {}
    args.cwd = this.rootDir
    if (this.debug) {
      args.env = {
        DEBUG: "*,-babel",
        PATH: process.env.PATH
      }
    }
    const command = this.makeFullPath(params.command)
    if (process.env.NODE_ENV === "coverage") {
      args.command = runWithTestCoverage(args.command)
    }
    this.process = createObservableProcess(command, args)
    await this.process.waitForEnd()
    if (process.env.NODE_ENV === "coverage") {
      await storeTestCoverage()
    }
    if (this.verbose) {
      this.output = this.process.output.fullText()
    }
    if (this.process.exitCode && !params.expectError) {
      console.log(this.output)
    }
  }

  this.makeFullPath = (command: string) => {
    if (/^text-run/.test(command)) {
      return command.replace(/^text-run/, this.fullTextRunPath())
    } else {
      return `${this.fullTextRunPath()} ${command}`
    }
  }

  this.fullTextRunPath = function() {
    let result = path.join(process.cwd(), "bin", "text-run")
    if (process.platform === "win32") {
      result += ".cmd"
    }
    return result
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
      .filter(file => fs.statSync(file).isFile())
      .map(file => path.relative(this.rootDir, file))
      .filter(file => file)
      .map(file => file.replace(/\\/g, "/"))
      .filter(file => filenames.indexOf(file) === -1)
    for (const fileShouldntRun of filesShouldntRun) {
      assert.notInclude(standardizedOutput, fileShouldntRun)
    }
  }

  this.verifyTestsRun = (count: number) => {
    assert.include(stripAnsi(this.process.output.fullText()), ` ${count} activities`)
  }

  this.verifyUnknownCommand = (command: string) => {
    assert.include(stripAnsi(this.process.output.fullText()), `unknown command: ${command}`)
  }
}

setWorldConstructor(World)

function standardizePath(filePath: string): string {
  return filePath.replace(/\\/g, "/")
}

/**
 * Returns the command that runs the given command with test coverage
 */
function runWithTestCoverage(command: string) {
  return path.join(process.cwd(), "node_modules", ".bin", "nyc") + " " + command
}

/**
 * Stores the test coverage data before running the next test that would overwrite it
 */
async function storeTestCoverage() {
  const outputPath = path.join(process.cwd(), ".nyc_output")
  try {
    await fs.stat(outputPath)
  } catch (e) {
    return
  }
  await fs.move(outputPath, path.join(process.cwd(), ".nyc_output_cli", uuid()))
}
