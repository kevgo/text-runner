import * as tr from "text-runner-core"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { Formatter } from "./formatter"
import { EventEmitter } from "events"

export function instantiateFormatter(config: tr.Configuration, emitter: EventEmitter): Formatter {
  switch (config.formatterName) {
    case "dot":
      return new DotFormatter(config, emitter)
    case "detailed":
      return new DetailedFormatter(config, emitter)
    case "progress":
      return new ProgressFormatter(config, emitter)
    case "summary":
      return new SummaryFormatter(config, emitter)
    default:
      throw new tr.UserError(
        `Unknown formatter: ${config.formatterName}`,
        "Available formatters are: detailed, dot, progress, summary"
      )
  }
}
