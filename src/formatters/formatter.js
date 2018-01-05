// @flow

import type {WriteStream} from 'observable-process'

const {bold, green, magenta} = require('chalk')
const Time = require('time-diff')

type Console = {
  log(text :string): void
}

// Base class for formatters
class Formatter {
  activityText: string
  console: Console
  endLine: number
  errorMessage: string
  filePath: string       // the path of the documentation file that is currently processed
  filesCount: number
  inAction: boolean      // whether this formatter is currently processing an action
  startLine: number      // the line within the documentation file at which the currently processed block starts
  stderr: WriteStream
  stdout: WriteStream
  stepsCount: number
  time: Time
  warningMessage: string
  warningsCount: number

  constructor () {
    // Note: I have to define these attributes here,
    //       since doing so at the class level
    //       binds them to the class scope for some reason
    this.activityText = ''
    this.errorMessage = ''
    this.filesCount = 0
    this.inAction = false
    this.stepsCount = 0
    this.warningsCount = 0
    this.stdout = { write: this.output }
    this.stderr = { write: this.output }
    this.console = {
      log: (text :string) => {
        this.output(`${text}\n`)
      }
    }

    this.time = new Time()
    this.time.start('formatter')
  }

  // Called on general errors
  error (errorMessage: string) {
    this.errorMessage = errorMessage
    this.inAction = false
  }

  output (text: string | Buffer): boolean {
    throw new Error('Implement in subclass')
  }

  setLines (startLine :number, endLine :number) {
    this.startLine = startLine
    this.endLine = endLine
  }

  skip (activityText: string) {
    if (activityText) this.activityText = activityText
    this.inAction = false
  }

  // Called when we start performing an activity that was defined in a block
  action (activityText :string) {
    this.activityText = activityText
    if (!this.inAction) {
      this.errorMessage = ''
      this.warningMessage = ''
      this.stepsCount += 1
      this.inAction = true
    }
  }

  // called when we start processing a markdown file
  startFile (filePath :string) {
    this.filePath = filePath
    this.filesCount += 1
  }

  // called when the last started activity finished successful
  // optionally allows to define the final text to be displayed
  success (activityText?: string) {
    if (activityText) this.activityText = activityText
    this.inAction = false
  }

  // called when the whole test suite passed
  suiteSuccess () {
    if (this.stepsCount === 0) {
      this.warning('no activities found')
      return
    }
    var text = green(`\nSuccess! ${this.stepsCount} steps in ${this.filesCount} files`)
    if (this.warningsCount > 0) {
      text += green(', ')
      text += magenta(`${this.warningsCount} warnings`)
    }
    text += green(`, ${this.time.end('formatter')}`)
    console.log(bold(text))
  }

  // Called on general warnings
  warning (warningMessage :string) {
    this.warningMessage = warningMessage
    this.warningsCount += 1
    this.inAction = false
  }
}

module.exports = Formatter
