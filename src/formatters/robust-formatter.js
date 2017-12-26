// @flow

const {bold, dim, green, magenta, red} = require('chalk')
const Formatter = require('./formatter')
const {compact, unique} = require('prelude-ls')

// colorFunction is a better name for functions that add colors to strings
type colorFunction = (text: string) => string

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

  _printActivityHeader (...colorFunctions: Array<colorFunction>) {
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
    console.log(this._applyColorFunctions(text, ...colorFunctions))
  }

  _applyColorFunctions (text: string, ...colorFunctions: Array<colorFunction>): string {
    for (let colorFunction of colorFunctions) {
      text = colorFunction(text)
    }
    return text
  }
}

module.exports = RobustFormatter
