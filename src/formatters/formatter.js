// @flow

import type { WriteStream } from 'observable-process'

const { bold, green, magenta } = require('chalk')
const Time = require('time-diff')
const UnprintedUserError = require('../errors/unprinted-user-error')

type Console = {
  log(text: string): void
}

// Base class for formatters
class Formatter {
  activityText: string
  console: Console
  errorMessage: string
  filePath: string // the path of the documentation file that is currently processed
  filePaths: string[] // the files encountered so far
  inActivity: boolean // whether this formatter is currently processing an action
  skipping: boolean // whether the current step is being skipped
  line: number // the line within the documentation file at which the currently processed block ends
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
    this.filePaths = []
    this.inActivity = false
    this.stepsCount = 0
    this.skipping = false
    this.warningsCount = 0
    this.stdout = { write: this.output }
    this.stderr = { write: this.output }
    this.console = {
      log: (text: string) => {
        this.output(`${text}\n`)
      }
    }

    this.time = new Time()
    this.time.start('formatter')
  }

  // Called on general errors
  error (errorMessage: string, filename?: string, line?: number) {
    this.errorMessage = errorMessage
    this.inActivity = false
  }

  output (text: string | Buffer): boolean {
    throw new Error('Implement in subclass')
  }

  setLines (line: ?number) {
    if (line != null) this.line = line
  }

  skip (activityText: string) {
    if (activityText) this.activityText = activityText
    this.inActivity = false
    this.skipping = true
  }

  // Called when we start performing an activity that was defined in a block
  setTitle (activityText: string) {
    this.activityText = activityText
  }

  startActivity (activityTypeName: string) {
    if (this.inActivity) {
      throw new UnprintedUserError(
        'already in a started block',
        this.filePath,
        this.line
      )
    }
    this.setTitle(activityTypeName)
    this.errorMessage = ''
    this.warningMessage = ''
    this.stepsCount += 1
    this.inActivity = true
    this.skipping = false
  }

  // called when we start processing a markdown file
  startFile (filePath: string) {
    this.filePath = filePath
    if (!this.filePaths.includes(filePath)) {
      this.filePaths.push(filePath)
    }
  }

  // called when the last started activity finished successful
  // optionally allows to define the final text to be displayed
  success (activityText?: string) {
    if (activityText) this.activityText = activityText
    this.inActivity = false
  }

  // called when the whole test suite passed
  suiteSuccess () {
    if (this.stepsCount === 0) {
      this.warning('no activities found')
      return
    }
    var text = green(
      `\nSuccess! ${this.stepsCount} blocks in ${this.filePaths.length} files`
    )
    if (this.warningsCount > 0) {
      text += green(', ')
      text += magenta(`${this.warningsCount} warnings`)
    }
    text += green(`, ${this.time.end('formatter')}`)
    console.log(bold(text))
  }

  // Called on general warnings
  warning (warningMessage: string) {
    this.warningMessage = warningMessage
    this.warningsCount += 1
    this.inActivity = false
  }
}

module.exports = Formatter
