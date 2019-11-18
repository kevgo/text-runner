import { UnprintedUserError } from "../errors/unprinted-user-error"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { ProgressFormatter } from "../formatters/progress-formatter"
import { Formatter } from "../formatters/types/formatter"
import { Configuration } from "./types/configuration"

export function instantiateFormatter(
  name: string | undefined,
  stepCount: number,
  configuration: Configuration
): Formatter {
  switch (name) {
    case "dot":
      return new DotFormatter(stepCount, configuration)
    case "detailed":
      return new DetailedFormatter(stepCount, configuration)
    case "progress":
      return new ProgressFormatter(stepCount, configuration)
    default:
      throw new UnprintedUserError(`Unknown formatter: ${name}\n\nAvailable formatters are: detailed, dot, progress`)
  }
}
