import * as tr from "text-runner-core"

import * as formatters from "."
import { DetailedFormatter } from "./detailed-formatter"
import { DotFormatter } from "./dot-formatter"
import { ProgressFormatter } from "./progress-formatter"
import { SummaryFormatter } from "./summary-formatter"

/** creates an instance of the formatter with the given name */
export function instantiate(name: formatters.Names, command: tr.commands.Command): formatters.Formatter {
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
      throw new tr.UserError(`Unknown formatter: ${name}`, "Available formatters are: detailed, dot, progress, summary")
  }
}
