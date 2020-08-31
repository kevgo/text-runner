/**
 * Represents a UserError that has not been printed via the formatter.
 * This happens for user errors before the formatter could be instantiated
 */
export class UserError extends Error {
  readonly filePath: string | undefined
  readonly line: number | undefined
  /** optional longer user-facing guidance on how to resolve the error */
  readonly guidance: string

  constructor(message: string, description?: string, filePath?: string, line?: number) {
    super(message)
    this.name = "UserError"
    this.guidance = description || ""
    this.filePath = filePath
    this.line = line
  }
}
