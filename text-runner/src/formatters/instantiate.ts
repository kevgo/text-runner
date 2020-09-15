import { UserError } from "../errors/user-error"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { Formatter } from "./formatter"
import { Configuration } from "../configuration/configuration"
import { SilentFormatter } from "./implementations/silent-formatter"

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
