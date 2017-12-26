// @flow

const {expect} = require('chai')
const dimConsole = require('dim-console')
const fs = require('fs-extra')
const glob = require('glob')
const ObservableProcess = require('observable-process')
const path = require('path')
const {compact, filter, flatten, map, reject} = require('prelude-ls')

const CliWorld = function () {
  this.execute = function (params: {command: string, expectError: boolean}, done: DoneFunction) {
    var args = {}
    args.cwd = this.rootDir.name,
    args.env = {}
    if (this.verbose) {
      args.stdout = dimConsole.process.stdout
      args.stderr = dimConsole.process.stderr
    } else {
      args.stdout = {write: (text) => this.output += text}
      args.stderr = {write: (text) => this.output += text}
    }
    if (this.debug) {
      args.env['DEBUG'] = '*'
    }

    this.process = new ObservableProcess(this.makeFullPath(params.command), args)
    this.process.on('ended', (exitCode) => {
      this.exitCode = exitCode
      if (this.verbose) this.output = dimConsole.output
      if (this.exitCode && !params.expectError) {
        console.log(this.output)
      }
      done()
    })
  }

  this.makeFullPath = (command: string): string => {
    if (/^text-run/.test(command)) {
      return command.replace(/^text-run/, this.fullTextRunPath())
    } else {
      return `${this.fullTextRunPath()} ${command}`
    }
  }

  this.fullTextRunPath = function (): string {
    var result = path.join(process.cwd(), 'bin', 'text-run')
    if (process.platform === 'win32') {
      result += '.cmd'
    }
    return result
  }

  this.verifyCallError = (expectedError: string) => {
    const output = this.process.fullOutput()
    expect(output).to.include(expectedError)
    expect(this.exitCode).to.equal(1)
  }

  this.verifyErrormessage = (expectedText: string) => {
    expect(this.process.fullOutput()).to.include(expectedText)
  }

  this.verifyFailure = (table) => {
    const output = this.process.fullOutput()
    var expectedHeader
    if (table.FILENAME && table.LINE) {
      expectedHeader = `${table.FILENAME}:${table.LINE}`
    } else if (table.FILENAME) {
      expectedHeader = `${table.FILENAME}`
    } else {
      expectedHeader = ''
    }
    if (table['MESSAGE']) {
      expectedHeader += ` -- ${table['MESSAGE']}`
    }
    expect(output).to.include(expectedHeader)
    expect(output).to.include(table['ERROR MESSAGE'])
    expect(this.exitCode).to.equal(parseInt(table['EXIT CODE']))
  }

  this.verifyOutput = (table) => {
    var expectedText = ''
    if (table.FILENAME) expectedText += table.FILENAME
    if (table.FILENAME && table.LINE) expectedText += `:${table.LINE}`
    if (table.FILENAME && (table.MESSAGE || table.WARNING)) expectedText += ' -- '
    if (table.MESSAGE) expectedText += table.MESSAGE
    if (table.WARNING) expectedText += table.WARNING
    expect(standardizePath(this.process.fullOutput())).to.include(expectedText)
  }

  this.verifyPrintedUsageInstructions = () => {
    expect(this.process.fullOutput()).to.include('COMMANDS')
  }

  this.verifyPrints = (expectedText: string) => {
    expect(new RegExp(expectedText).test(this.process.fullOutput())).to.be.true
  }

  this.verifyRanConsoleCommand = (command: string, done: DoneFunction) => {
    expect(this.process.fullOutput()).to.include(`running.md:1-5 -- running console command: ${command}`)
    done()
  }

  this.verifyRanOnlyTests = (filenames: string[]) => {
    filenames = flatten(filenames)
    const standardizedOutput = this.output.replace(/\\/g, '/')

    // verify the given tests have run
    for (let filename of filenames) {
      expect(standardizedOutput).to.include(filename)
    }

    // verify all other tests have not run
    const filesShouldntRun = glob.sync(`${this.rootDir.name}/**`)
                                 .filter((file) => fs.statSync(file).isFile())
                                 .map((file) => path.relative(this.rootDir.name, file))
                                 .filter((file) => file)
                                 .map((file) => file.replace(/\\/g, '/'))
                                 .filter((file) => filenames.indexOf(file) === -1)
    for (let fileShouldntRun of filesShouldntRun) {
      expect(standardizedOutput).to.not.include(fileShouldntRun)
    }
  }

  this.verifyTestsRun = (count) => {
    expect(this.process.fullOutput()).to.include(` ${count} steps`)
  }

  this.verifyUnknownCommand = (command) => {
    expect(this.process.fullOutput()).to.include(`unknown command: ${command}`)
  }
}

function standardizePath (path: string): string {
  return path.replace(/\\/g, '/')
}

module.exports = function () {
  if (process.env.EXOSERVICE_TEST_DEPTH === 'CLI') {
    this.World = CliWorld
  }
}
