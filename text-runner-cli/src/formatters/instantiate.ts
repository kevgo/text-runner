import * as textRunner from "text-runner-core"

import { DetailedFormatter } from "./detailed-formatter.js"
import { DotFormatter } from "./dot-formatter.js"
import * as formatters from "./index.js"
import { ProgressFormatter } from "./progress-formatter.js"
import { SummaryFormatter } from "./summary-formatter.js"

/** creates an instance of the formatter with the given name */
export function instantiate(name: formatters.Names, command: textRunner.commands.Command): formatters.Formatter {
  switch (name) {
    case "dot":
      return new DotFormatter(command)
    case "detailed":
      return new DetailedFormatter(command)
    case "progress":
      return new ProgressFormatter(command)
    case "summary":
      return new SummaryFormatter(command)
    default:
      throw new textRunner.UserError(
        `Unknown formatter: ${name}`,
        "Available formatters are: detailed, dot, progress, summary",
      )
  }
}
