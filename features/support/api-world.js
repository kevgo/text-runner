// @flow

import type { ExecuteArgs } from './execute-args.js'
import type { Activity } from '../../src/activity-list/activity.js'

const AstNodeList = require('../../src/parsers/ast-node-list.js')
const { setWorldConstructor } = require('cucumber')
const textRunner = require('../../src/text-runner.js')
const { expect } = require('chai')
const { cyan } = require('chalk')
const flatten = require('array-flatten')
const Formatter = require('../../src/formatters/formatter.js')
const fs = require('fs-extra')
const glob = require('glob')
const jsdiffConsole = require('jsdiff-console')
const path = require('path')
const StatsCounter = require('../../src/runners/stats-counter.js')
const stripAnsi = require('strip-ansi')
const waitUntil = require('wait-until-promise').default

class TestFormatter extends Formatter {
  verbose: boolean
  successMessage: string
  errorMessage: string
  warningMessage: string

  constructor (
    activity: Activity,
    statsCounter: StatsCounter,
    verbose: boolean
  ) {
    super(activity, '', statsCounter)
    this.verbose = verbose
    this.successMessage = ''
    this.errorMessage = ''
    this.warningMessage = ''
  }

  error (message: string) {
    super.error(message)
    this.errorMessage = message
    if (this.verbose) console.log(message)
  }

  warning (message: string) {
    super.warning(message)
    this.warningMessage = message
  }
}

const ApiWorld = function () {
  // ApiWorld provides step implementations that run and test TextRunner
  // via its Javascript API

  this.execute = async function (args: ExecuteArgs) {
    const existingDir = process.cwd()
    process.chdir(this.rootDir)
    const activity = {
      type: args.command,
      file: args.file,
      line: 0,
      nodes: new AstNodeList()
    }
    const statsCounter = new StatsCounter()
    this.formatter = new TestFormatter(activity, statsCounter, this.verbose)
    const error = await textRunner({ command: args.command })
    process.chdir(existingDir)
    this.output = this.formatter.text
    if (this.error && !args.expectError) {
      // Signal the error to the Cucumber runtime
      throw error
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
    if (!this.output.includes(expectedText)) {
      throw new Error(
        `Expected\n\n${cyan(this.output)}\n\nto contain\n\n${cyan(
          expectedText
        )}\n`
      )
    }
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
