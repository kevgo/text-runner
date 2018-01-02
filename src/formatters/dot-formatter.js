// @flow

const {cyan, green, magenta, red} = require('chalk')
const Formatter = require('./formatter')

// A minimalistic formatter, prints dots for each check
class DotFormatter extends Formatter {
  error (errorMessage: string) {
    super.error(errorMessage)
    console.log(red(errorMessage))
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
