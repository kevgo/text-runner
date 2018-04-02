// @flow

const { codeFrameColumns } = require('@babel/code-frame')
const fs = require('fs')
const { red } = require('chalk')
const UserError = require('./user-error.js')

// Represents a UserError that has not been printed via the formatter.
// This happens for user errors before the formatter could be instantiated
module.exports = class UnprintedUserError extends UserError {
  filePath: ?string
  line: ?number

  constructor (message: string, filePath?: string, line?: ?number) {
    super(message)
    this.filePath = filePath
    this.line = line
  }

  print (output: string => void) {
    output(red(this.message))
    if (this.filePath != null && this.line != null) {
      const fileContent = fs.readFileSync(this.filePath)
      output(
        codeFrameColumns(
          fileContent,
          { start: this.line },
          { forceColor: true }
        )
      )
    }
  }
}
