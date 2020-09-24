import * as tr from "text-runner-core"
import { DetailedFormatter } from "./detailed-formatter"
import { DotFormatter } from "./dot-formatter"
import { ProgressFormatter } from "./progress-formatter"
import { SummaryFormatter } from "./summary-formatter"
import * as formatters from "."

/** creates an instance of the formatter with the given name */
export function instantiate(
  name: formatters.Names,
  sourceDir: string,
  command: tr.commands.Command
): formatters.Formatter {
  switch (name) {
    case "dot":
      return new DotFormatter(sourceDir, command)
    case "detailed":
      return new DetailedFormatter(sourceDir, command)
    case "progress":
      return new ProgressFormatter(sourceDir, command)
    case "summary":
      return new SummaryFormatter(sourceDir, command)
    default:
      throw new tr.UserError(`Unknown formatter: ${name}`, "Available formatters are: detailed, dot, progress, summary")
  }
}
