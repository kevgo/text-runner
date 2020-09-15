import { AbsoluteFilePath } from "../filesystem/absolute-file-path"

/**
 * Represents a UserError that has not been printed via the formatter.
 * This happens for user errors before the formatter could be instantiated
 */
export class UserError extends Error {
  /** optional longer user-facing guidance on how to resolve the error */
  readonly guidance: string
  readonly file: AbsoluteFilePath | undefined
  readonly line: number | undefined

  constructor(message: string, guidance?: string, file?: AbsoluteFilePath, line?: number) {
    super(message)
    this.name = "UserError"
    this.guidance = guidance || ""
    this.file = file
    this.line = line
  }
}
