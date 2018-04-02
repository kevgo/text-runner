const { setWorldConstructor } = require('cucumber')
const textRunner = require('../../dist/text-runner.js')
const { expect } = require('chai')
const { cyan } = require('chalk')
const flatten = require('array-flatten')
const fs = require('fs-extra')
const glob = require('glob')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')
const stripAnsi = require('strip-ansi')
const waitUntil = require('wait-until-promise').default

class TestFormatter {
  constructor ({ verbose }) {
    this.verbose = verbose
    this.activities = []
    this.errorMessages = []
    this.filePaths = []
    this.lines = []
    this.text = ''
    this.console = {
      log: text => {
        this.text += `${text}\n`
      }
    }
    this.stdout = {
      write: text => {
        this.text += text
      }
    }
    this.stderr = {
      write: text => {
        this.text += text
      }
    }
    this.warnings = []
  }

  startActivity (activityTypeName) {
    this.activities.push(stripAnsi(activityTypeName))
    this.lines.push(this.line.toString())
    if (this.verbose) console.log(activityTypeName)
  }

  startFile (filePath) {
    if (!this.filePaths.includes(filePath)) {
      this.filePaths.push(filePath)
    }
  }

  setTitle (activity) {
    this.activities[this.activities.length - 1] = stripAnsi(activity)
  }

  success (activity) {
    if (activity) {
      this.activities[this.activities.length - 1] = stripAnsi(activity)
      if (this.verbose) console.log(activity)
    }
    if (this.verbose) console.log('success')
  }

  error (error) {
    this.errorMessages.push(stripAnsi(error.message || error.toString()))
    this.lines.push(this.line)
    if (this.verbose) console.log(error)
  }

  output (text) {
    if (this.verbose) console.log(text)
  }

  setLines (line) {
    this.line = line
  }

  skip (activity) {
    this.activities.push(stripAnsi(activity))
  }

  suiteSuccess (stepsCount) {
    this.stepsCount = stepsCount
  }

  warning (warning) {
    this.warnings.push(stripAnsi(warning))
    this.activities.push(stripAnsi(warning))
  }
}

const ApiWorld = function () {
  // ApiWorld provides step implementations that run and test TextRunner
  // via its Javascript API

  this.execute = async function (args) {
    const existingDir = process.cwd()
    process.chdir(this.rootDir)
    this.formatter = new TestFormatter({ verbose: this.verbose })
    const formatter = args.format || this.formatter
    try {
      await textRunner({
        command: args.command,
        file: args.file,
        offline: args.offline,
        exclude: args.exclude,
        format: formatter
      })
    } catch (err) {
      this.error = err
    }
    this.cwdAfterRun = process.cwd()
    process.chdir(existingDir)
    this.output = this.formatter.text
    if (this.error && !args.expectError) {
      // Signal the error to the Cucumber runtime
      throw this.error
    }
  }

  this.verifyCallError = expectedError => {
    jsdiffConsole(this.error, expectedError)
  }

  this.verifyErrormessage = expectedText => {
    var actual = stripAnsi(this.formatter.errorMessages.join())
    if (this.error) {
      actual += stripAnsi(this.error.message)
    }
    const expected = stripAnsi(expectedText)
    if (!actual.includes(expected)) {
      throw new Error(
        `Expected\n\n${cyan(actual)}\n\nto contain\n\n${cyan(expected)}\n`
      )
    }
  }

  this.verifyPrints = expectedText => {
    // No way to capture console output here.
    // This is tested in the CLI world.
  }

  this.verifyFailure = table => {
    if (
      this.formatter.errorMessages.some(
        message => message.includes(table['ERROR MESSAGE']).length === 0
      )
    ) {
      throw new Error(
        `Expected\n\n${cyan(
          JSON.stringify(this.formatter.errorMessages)
        )}\n\nto contain\n\n${cyan(table['ERROR MESSAGE'])}\n`
      )
    }
    if (table.FILENAME) {
      expect(this.formatter.filePaths).to.include(table.FILENAME)
    }
    if (table.LINE) expect(this.formatter.lines).to.include(table.LINE)
  }

  this.verifyOutput = table => {
    if (table.FILENAME) {
      expect(standardizePaths(this.formatter.filePaths)).to.include(
        table.FILENAME,
        `${this.formatter.filePaths}`
      )
    }
    if (table.LINE) expect(this.formatter.lines).to.include(table.LINE)

    if (table.MESSAGE) {
      const activities = standardizePaths(this.formatter.activities)
      if (!activities.some(activity => activity.includes(table.MESSAGE))) {
        throw new Error(
          `activity ${cyan(table.MESSAGE)} not found in ${activities.join(
            ', '
          )}`
        )
      }
    }
    if (table.WARNING) {
      expect(standardizePaths(this.formatter.warnings)).to.include(
        table.WARNING
      )
    }
  }

  this.verifyRanConsoleCommand = async command => {
    await waitUntil(() =>
      this.formatter.activities.includes(`running console command: ${command}`)
    )
  }

  this.verifyRanOnlyTests = files => {
    files = flatten(files)
    for (let file of files) {
      expect(this.formatter.filePaths).to.include(
        file,
        this.formatter.filePaths
      )
    }

    // verify all other tests have not run
    const filesShouldntRun = glob
      .sync(`${this.rootDir}/**`)
      .filter(filename => fs.statSync(filename).isFile())
      .map(filename => path.relative(this.rootDir, filename))
      .filter(filename => filename)
      .map(filename => filename.replace(/\\/g, '/'))
      .filter(filename => files.indexOf(filename) === -1)
    for (let fileShouldntRun of filesShouldntRun) {
      expect(this.formatter.filePaths).to.not.include(fileShouldntRun)
    }
  }

  this.verifyTestsRun = count => {
    expect(this.formatter.activities).to.have.length(count)
  }

  this.verifyUnknownCommand = command => {
    expect(this.error).to.equal(`unknown command: ${command}`)
  }
}

function standardizePaths (paths) {
  return paths.map(path => path.replace(/\\/g, '/'))
}

if (process.env.EXOSERVICE_TEST_DEPTH === 'API') {
  setWorldConstructor(ApiWorld)
}
