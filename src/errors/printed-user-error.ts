import UserError from './user-error.js'

// Represents a UserError that has already been printed via the formatter.
// When receiving it, it should not be printed again.
export default class PrintedUserError extends UserError {}
