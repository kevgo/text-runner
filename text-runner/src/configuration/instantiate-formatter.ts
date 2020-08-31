import { UserError } from "../errors/user-error"
import { DetailedFormatter } from "../formatters/detailed-formatter"
import { DotFormatter } from "../formatters/dot-formatter"
import { ProgressFormatter } from "../formatters/progress-formatter"
import { SummaryFormatter } from "../formatters/summary-formatter"
import { Formatter } from "../formatters/types/formatter"
import { Configuration } from "./types/configuration"
import { SilentFormatter } from "../formatters/silent-formatter"

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
    case "silent":
      return new SilentFormatter(stepCount, configuration)
    case "summary":
      return new SummaryFormatter(stepCount, configuration)
    default:
      throw new UserError(
        `Unknown formatter: ${name}`,
        "Available formatters are: detailed, dot, progress, silent, summary"
      )
  }
}
