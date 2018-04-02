// @flow

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
}
