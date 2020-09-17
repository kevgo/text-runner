import * as tr from "text-runner-core"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { Formatter, FormatterName } from "./formatter"
import * as events from "events"

export function instantiateFormatter(
  name: FormatterName,
  config: tr.Configuration,
  emitter: events.EventEmitter
): Formatter {
  switch (name) {
    case "dot":
      return new DotFormatter(config, emitter)
    case "detailed":
      return new DetailedFormatter(config, emitter)
    case "progress":
      return new ProgressFormatter(config, emitter)
    case "summary":
      return new SummaryFormatter(config, emitter)
    default:
      throw new tr.UserError(`Unknown formatter: ${name}`, "Available formatters are: detailed, dot, progress, summary")
  }
}
