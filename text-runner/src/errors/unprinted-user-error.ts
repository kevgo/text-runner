/**
 * Represents a UserError that has not been printed via the formatter.
 * This happens for user errors before the formatter could be instantiated
 */
export class UnprintedUserError extends Error {
  readonly filePath: string | undefined
  readonly line: number | undefined

  constructor(message: string, filePath?: string, line?: number) {
    super(message)
    this.filePath = filePath
    this.line = line
  }
}
