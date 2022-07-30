import * as files from "../filesystem/index"

/**
 * Represents a UserError that has not been printed via the formatter.
 * This happens for user errors before the formatter could be instantiated
 */
export class UserError extends Error {
  /** optional longer user-facing guidance on how to resolve the error */
  readonly guidance: string
  readonly location: files.Location | undefined

  constructor(message: string, guidance: string, location?: files.Location) {
    super(message)
    this.name = "UserError"
    this.guidance = guidance
    this.location = location
  }
}

export function isUserError(arg: unknown): arg is UserError {
  return arg instanceof Error && arg.name === "UserError"
}
