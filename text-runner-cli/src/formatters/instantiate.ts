import * as tr from "text-runner-core"
import { DetailedFormatter } from "./detailed-formatter"
import { DotFormatter } from "./dot-formatter"
import { ProgressFormatter } from "./progress-formatter"
import { SummaryFormatter } from "./summary-formatter"
import * as events from "events"
import * as formatters from "."

/** creates an instance of the formatter with the given name */
export function instantiate(
  name: formatters.Names,
  sourceDir: string,
  emitter: events.EventEmitter
): formatters.Formatter {
  switch (name) {
    case "dot":
      return new DotFormatter(sourceDir, emitter)
    case "detailed":
      return new DetailedFormatter(sourceDir, emitter)
    case "progress":
      return new ProgressFormatter(sourceDir, emitter)
    case "summary":
      return new SummaryFormatter(sourceDir, emitter)
    default:
      throw new tr.UserError(`Unknown formatter: ${name}`, "Available formatters are: detailed, dot, progress, summary")
  }
}
