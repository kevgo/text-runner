import { FullPath } from "../filesystem/full-path"

/**
 * Represents a UserError that has not been printed via the formatter.
 * This happens for user errors before the formatter could be instantiated
 */
export class UserError extends Error {
  /** optional longer user-facing guidance on how to resolve the error */
  readonly guidance: string
  readonly file: FullPath | undefined
  readonly line: number | undefined

  constructor(message: string, guidance?: string, file?: FullPath, line?: number) {
    super(message)
    this.name = "UserError"
    this.guidance = guidance || ""
    this.file = file
    this.line = line
  }
}

export function instanceOfUserError(arg: Error): arg is UserError {
  return arg.name === "UserError"
}
