import { UserError } from "text-runner-core"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import { Formatter } from "./formatter"
import { Configuration } from "text-runner-core"
import { EventEmitter } from "events"

export function instantiateFormatter(config: Configuration, emitter: EventEmitter): Formatter {
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
      throw new UserError(`Unknown formatter: ${name}`, "Available formatters are: detailed, dot, progress, summary")
  }
}
