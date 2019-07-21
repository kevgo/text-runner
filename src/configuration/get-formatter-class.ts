import { UnprintedUserError } from "../errors/unprinted-user-error"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { FormatterImplemention } from "../formatters/formatter-implementation"

export function getFormatterClass(
  name: string | undefined,
  defaultClass: FormatterImplemention
): FormatterImplemention {
  if (!name) {
    return defaultClass
  }
  if (name === "dot") {
    return DotFormatter
  }
  if (name === "detailed") {
    return DetailedFormatter
  }
  throw new UnprintedUserError(
    `Unknown formatter: ${name}\n\nAvailable formatters are: detailed, dot`
  )
}
