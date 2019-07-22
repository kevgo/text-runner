import { UnprintedUserError } from "../errors/unprinted-user-error"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { Formatter } from "../formatters/formatter"
import { Configuration } from "./configuration"

export function instantiateFormatter(
  name: string | undefined,
  stepCount: number,
  configuration: Configuration
): Formatter {
  if (name === "dot") {
    return new DotFormatter(stepCount, configuration)
  }
  if (name === "detailed") {
    return new DetailedFormatter(stepCount, configuration)
  }
  throw new UnprintedUserError(
    `Unknown formatter: ${name}\n\nAvailable formatters are: detailed, dot`
  )
}
