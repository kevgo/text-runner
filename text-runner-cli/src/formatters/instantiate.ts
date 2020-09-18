import * as tr from "text-runner-core"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { Formatter, FormatterName } from "./formatter"
import * as events from "events"

export function instantiateFormatter(name: FormatterName, sourceDir: string, emitter: events.EventEmitter): Formatter {
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
