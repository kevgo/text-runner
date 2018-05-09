// @flow

const { dim, cyan, green, magenta, red } = require('chalk')
const Formatter = require('./formatter')
const printCodeFrame = require('../helpers/print-code-frame')

class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

  error (errorMessage: string) {
    super.error(errorMessage)
    console.log()
    console.log(dim(this.output))
    console.log(
      red(
        `${this.activity.file}:${this.activity.line} ${
          this.title
        } -- ${errorMessage}`
      )
    )
    printCodeFrame(console.log, this.activity.file, this.activity.line)
  }

  skip (message: string) {
    super.skip(message)
    console.log(cyan('.'))
  }

  success () {
    super.success()
    console.log(green('.'))
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    console.log(magenta('.'))
  }
}

module.exports = DotFormatter
