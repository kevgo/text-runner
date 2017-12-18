// @flow

const {bold, dim, green, magenta, red} = require('chalk')
const Formatter = require('./formatter')
const {compact, unique} = require('prelude-ls')

// A very robust formatter, prints output before the step name
class RobustFormatter extends Formatter {
  error (errorMessage: string) {
    super.error(errorMessage)
    this._printActivityHeader(bold, red)
  }

  output (text: string) {
    console.log(dim(text.trim()))
  }

  success (activityText: string) {
    super.success(activityText)
    this._printActivityHeader(green)
  }

  warning (warningMessage: string) {
    super.warning(warningMessage)
    this.activityText = ''
    this._printActivityHeader(bold, magenta)
  }

  _printActivityHeader (...colors: Array<any>) {
    var text = ''
    if (this.filePath) {
      text += this.filePath
      if (this.startLine) {
        text += `:`
        text += unique(compact([this.startLine, this.endLine])).join('-')
      }
      text += ' -- '
    }
    if (this.activityText) text += this.activityText
    if (this.warningMessage) text += this.warningMessage
    if (this.errorMessage) text += `\n${this.errorMessage}`
    for (let color of colors) {
      text = color(text)
    }
    console.log(text)
  }
}

module.exports = RobustFormatter
