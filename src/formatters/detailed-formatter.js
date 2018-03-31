// @flow

const { bold, cyan, dim, green, magenta, red } = require('chalk')
const Formatter = require('./formatter')
const unique = require('array-unique')

// colorFunction is a better name for functions that add colors to strings
type colorFunction = (text: string) => string

class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  error (errorMessage: string) {
    super.error(errorMessage)
    this._printActivityHeader(bold, red)
  }

  output (text: string | Buffer): boolean {
    console.log(dim(text.toString().trim()))
    return false
  }

  skip (activityText: string) {
    super.skip(activityText)
    this._printActivityHeader(cyan)
  }

  success (activityText?: string) {
    super.success(activityText)
    if (!this.skipping) {
      this._printActivityHeader(green)
    }
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    this.activityText = ''
    this._printActivityHeader(bold, magenta)
  }

  _printActivityHeader (...colorFunctions: Array<colorFunction>) {
    var text = ''
    if (this.filePath) {
      text += this.filePath
      if (this.startLine) {
        text += `:`
        text += unique([this.startLine, this.endLine])
          .filter(a => a)
          .join('-')
      }
      text += ' -- '
    }
    if (this.activityText) text += this.activityText
    if (this.warningMessage) text += this.warningMessage
    if (this.errorMessage) text += this.errorMessage
    console.log(this._applyColorFunctions(text, ...colorFunctions))
  }

  _applyColorFunctions (
    text: string,
    ...colorFunctions: Array<colorFunction>
  ): string {
    for (let colorFunction of colorFunctions) {
      text = colorFunction(text)
    }
    return text
  }
}

module.exports = DetailedFormatter
