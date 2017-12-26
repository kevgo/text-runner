// @flow

const {bold, green, magenta} = require('chalk')
const Time = require('time-diff')

type Console = {
  log(text :string): void
}

type Stream = {
  write(text :string): void
}

// Base class for formatters
class Formatter {
  activityText: string
  console: Console
  endLine: number
  errorMessage: string
  filePath: string       // the path of the documentation file that is currently processed
  filesCount: number
  startLine: number      // the line within the documentation file at which the currently processed block starts
  stderr: Stream
  stdout: Stream
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
  }

  output (text: string) {
    throw new Error('Implement in subclass')
  }

  // Called when we start performing an activity that was defined in a block
  refine (activityText :string) {
    this.activityText = activityText
  }

  setLines (startLine :number, endLine :number) {
    this.startLine = startLine
    this.endLine = endLine
  }

  // Called when we start performing an activity that was defined in a block
  start (activityText :string) {
    this.activityText = activityText
    this.errorMessage = ''
    this.warningMessage = ''
    this.stepsCount += 1
  }

  // called when we start processing a markdown file
  startFile (filePath :string) {
    this.filePath = filePath
    this.filesCount += 1
  }

  // called when the last started activity finished successful
  // optionally allows to define the final text to be displayed
  success (activityText: string) {
    if (activityText) this.activityText = activityText
  }

  // called when the whole test suite passed
  suiteSuccess () {
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
  }
}

module.exports = Formatter
