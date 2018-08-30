// @flow

const { dim, cyan, green, magenta, red } = require('chalk')
const Formatter = require('./formatter')
const path = require('path')
const printCodeFrame = require('../helpers/print-code-frame')

class DotFormatter extends Formatter {
  // A minimalistic formatter, prints dots for each check

  error (errorMessage: string) {
    super.error(errorMessage)
    console.log()
    console.log(dim(this.output))
    process.stdout.write(
      red(`${this.activity.file.platformified()}:${this.activity.line} -- `)
    )
    console.log(errorMessage)
    printCodeFrame(
      console.log,
      path.join(this.sourceDir, this.activity.file.platformified()),
      this.activity.line
    )
  }

  skip (message: string) {
    super.skip(message)
    process.stdout.write(cyan('.'))
  }

  success () {
    super.success()
    process.stdout.write(green('.'))
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    process.stdout.write(magenta('.'))
  }
}

module.exports = DotFormatter
