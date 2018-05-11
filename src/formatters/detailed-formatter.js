// @flow

const { cyan, dim, green, magenta, red } = require('chalk')
const Formatter = require('./formatter')
const printCodeFrame = require('../helpers/print-code-frame')

class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  error (errorMessage: string) {
    super.error(errorMessage)
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
    console.log(dim(this.output))
    console.log(
      cyan(
        `${this.activity.file}:${this.activity.line} ${
          this.title
        } -- ${message}`
      )
    )
  }

  success () {
    super.success()
    console.log(dim(this.output))
    console.log(
      green(`${this.activity.file}:${this.activity.line} -- ${this.title}`)
    )
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    console.log(dim(this.output))
    console.log(
      magenta(
        `${this.activity.file}:${this.activity.line} ${
          this.title
        } -- ${warningMessage}`
      )
    )
  }
}

module.exports = DetailedFormatter
