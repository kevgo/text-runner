// @flow

const { dim, green, magenta, red } = require('chalk')
const Formatter = require('./formatter')
const path = require('path')
const printCodeFrame = require('../helpers/print-code-frame')

class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  error (errorMessage: string) {
    super.error(errorMessage)
    console.log(dim(this.output))
    process.stdout.write(red(`${this.activity.file}:${this.activity.line} -- `))
    console.log(errorMessage)
    const filePath = path.join(this.sourceDir, this.activity.file)
    printCodeFrame(console.log, filePath, this.activity.line)
  }

  skip (message: string) {
    super.skip(message)
    console.log(dim(this.output))
    console.log(
      magenta(`${this.activity.file}:${this.activity.line} -- ${message}`)
    )
  }

  success () {
    super.success()
    if (this.output) console.log(dim(this.output))
    console.log(
      green(`${this.activity.file}:${this.activity.line} -- ${this.title}`)
    )
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    console.log(dim(this.output))
    console.log(
      magenta(
        `${this.activity.file}:${this.activity.line} -- ${warningMessage}`
      )
    )
  }
}

module.exports = DetailedFormatter
