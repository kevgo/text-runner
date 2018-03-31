// @flow

const { cyan, green, magenta } = require('chalk')
const Formatter = require('./formatter')

class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

  error (errorMessage: string) {
    super.error(errorMessage)
    var output = ''
    if (this.filePath) output += this.filePath
    if (this.startLine) output += `:${this.startLine}`
    if (this.endLine && this.endLine !== this.startLine) { output += `-${this.endLine}` }
    if (this.filePath) output += ' -- '
    output += errorMessage
    console.log(output)
  }

  output (text: string | Buffer): boolean {
    return false
  }

  success (activityText?: string) {
    super.success(activityText)
    if (!this.skipping) {
      process.stdout.write(green('.'))
    }
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    process.stdout.write(magenta('.'))
  }

  skip (activity: string) {
    super.skip(activity)
    process.stdout.write(cyan('.'))
  }
}

module.exports = DotFormatter
