// @flow

const {cyan, green, magenta} = require('chalk')
const Formatter = require('./formatter')

// A minimalistic formatter, prints dots for each check
class DotFormatter extends Formatter {
  error (errorMessage: string) {
    super.error(errorMessage)
    var output = ''
    if (this.filePath) output += this.filePath
    if (this.startLine) output += `:${this.startLine}`
    if (this.endLine && this.endLine !== this.startLine) output += `-${this.endLine}`
    if (this.filePath) output += ' -- '
    output += errorMessage
    console.log(output)
  }

  output (text: string | Buffer): boolean {
    return false
  }

  success (activityText?: string) {
    super.success(activityText)
    process.stdout.write(green('.'))
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    process.stdout.write(magenta('.'))
  }

  skip (activity: string) {
    process.stdout.write(cyan('.'))
  }
}

module.exports = DotFormatter
