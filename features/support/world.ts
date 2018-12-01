import flatten from 'array-flatten'
import { expect } from 'chai'
import { setWorldConstructor } from 'cucumber'
import dimConsole from 'dim-console'
import fs from 'fs-extra'
import glob from 'glob'
import { ObservableProcess } from 'observable-process'
import path from 'path'
import stripAnsi from 'strip-ansi'
import { v4 as uuid } from 'uuid'

const World = function() {
  // World provides step implementations that run and test TextRunner
  // via its command-line interface

  this.execute = async function(params) {
    const args: any = {}
    args.cwd = this.rootDir
    args.env = {}
    this.output = ''
    if (this.verbose) {
      args.stdout = dimConsole.process.stdout
      args.stderr = dimConsole.process.stderr
    } else {
      args.stdout = {
        write: text => {
          this.output += text
          return false
        }
      }
      args.stderr = {
        write: text => {
          this.output += text
          return false
        }
      }
    }
    if (this.debug) {
      args.env.DEBUG = '*,-babel'
    }

    args.command = this.makeFullPath(params.command)
    if (process.env.NODE_ENV === 'coverage') {
      args.command = runWithTestCoverage(args.command)
    }
    this.process = new ObservableProcess(args)
    await this.process.waitForEnd()
    if (process.env.NODE_ENV === 'coverage') {
      storeTestCoverage()
    }
    if (this.verbose) {
      this.output = dimConsole.output
    }
    if (this.process.exitCode && !params.expectError) {
      console.log(this.output)
    }
  }

  this.makeFullPath = command => {
    if (/^text-run/.test(command)) {
      return command.replace(/^text-run/, this.fullTextRunPath())
    } else {
      return `${this.fullTextRunPath()} ${command}`
    }
  }

  this.fullTextRunPath = function() {
    let result = path.join(process.cwd(), 'bin', 'text-run')
    if (process.platform === 'win32') {
      result += '.cmd'
    }
    return result
  }

  this.verifyCallError = expectedError => {
    const output = stripAnsi(this.process.fullOutput())
    expect(output).to.include(expectedError)
    expect(this.process.exitCode).to.equal(1)
  }

  this.verifyErrormessage = expectedText => {
    expect(stripAnsi(this.process.fullOutput())).to.include(expectedText)
  }

  this.verifyFailure = table => {
    const output = stripAnsi(this.process.fullOutput())
    let expectedHeader
    if (table.FILENAME && table.LINE) {
      expectedHeader = `${table.FILENAME}:${table.LINE}`
    } else if (table.FILENAME) {
      expectedHeader = `${table.FILENAME}`
    } else {
      expectedHeader = ''
    }
    if (table.MESSAGE) {
      expectedHeader += ` -- ${table.MESSAGE}`
    }
    expect(output).to.include(expectedHeader)
    expect(output).to.match(new RegExp(table['ERROR MESSAGE']))
    expect(this.process.exitCode).to.equal(
      parseInt(table['EXIT CODE'], 10),
      'exit code'
    )
  }

  this.verifyOutput = table => {
    let expectedText = ''
    if (table.FILENAME) {
      expectedText += table.FILENAME
    }
    if (table.FILENAME && table.LINE) {
      expectedText += `:${table.LINE}`
    }
    if (table.FILENAME && (table.MESSAGE || table.WARNING)) {
      expectedText += ' -- '
    }
    if (table.MESSAGE) {
      expectedText += table.MESSAGE
    }
    if (table.WARNING) {
      expectedText += table.WARNING
    }
    const actual = standardizePath(stripAnsi(this.process.fullOutput()))
    if (!actual.includes(expectedText)) {
      throw new Error(`Mismatching output!
Looking for: ${expectedText}
Actual content:
${actual}
`)
    }
  }

  this.verifyPrintedUsageInstructions = () => {
    expect(stripAnsi(this.process.fullOutput())).to.include('COMMANDS')
  }

  this.verifyPrints = (expectedText: string) => {
    const output = stripAnsi(this.process.fullOutput().trim())
    if (!new RegExp(expectedText.trim()).test(output)) {
      throw new Error(
        `expected to find regex '${expectedText.trim()}' in '${output}'`
      )
    }
  }

  this.verifyPrintsNot = (text: string) => {
    const output = stripAnsi(this.process.fullOutput())
    if (new RegExp(text).test(output)) {
      throw new Error(`expected to not find regex '${text}' in '${output}'`)
    }
  }

  this.verifyRanConsoleCommand = (command: string) => {
    expect(stripAnsi(this.process.fullOutput())).to.include(
      `running console command: ${command}`
    )
  }

  this.verifyRanOnlyTests = filenames => {
    filenames = flatten(filenames)
    const standardizedOutput = this.output.replace(/\\/g, '/')

    // verify the given tests have run
    for (const filename of filenames) {
      expect(standardizedOutput).to.include(filename)
    }

    // verify all other tests have not run
    const filesShouldntRun = glob
      .sync(`${this.rootDir}/**`)
      .filter(file => fs.statSync(file).isFile())
      .map(file => path.relative(this.rootDir, file))
      .filter(file => file)
      .map(file => file.replace(/\\/g, '/'))
      .filter(file => filenames.indexOf(file) === -1)
    for (const fileShouldntRun of filesShouldntRun) {
      expect(standardizedOutput).to.not.include(fileShouldntRun)
    }
  }

  this.verifyTestsRun = (count: number) => {
    expect(stripAnsi(this.process.fullOutput())).to.include(
      ` ${count} activities`
    )
  }

  this.verifyUnknownCommand = (command: string) => {
    expect(stripAnsi(this.process.fullOutput())).to.include(
      `unknown command: ${command}`
    )
  }
}

setWorldConstructor(World)

function standardizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/')
}

// Returns the command that runs the given command with test coverage
function runWithTestCoverage(command: string) {
  return path.join(process.cwd(), 'node_modules', '.bin', 'nyc') + ' ' + command
}

// store the test coverage data before running the next test that would overwrite it
function storeTestCoverage() {
  const outputPath = path.join(process.cwd(), '.nyc_output')
  if (fs.existsSync(outputPath)) {
    fs.moveSync(outputPath, path.join(process.cwd(), '.nyc_output_cli', uuid()))
  }
}
