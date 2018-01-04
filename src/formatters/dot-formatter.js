// @flow

const {cyan, green, magenta, red} = require('chalk')
const Formatter = require('./formatter')

class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

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
    super.skip(activity)
    process.stdout.write(cyan('.'))
  }
}

module.exports = DotFormatter
