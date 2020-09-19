import { Stats } from "../helpers/stats-collector"
import * as tr from "text-runner-core"
import { DetailedFormatter } from "./implementations/detailed-formatter"
import { DotFormatter } from "./implementations/dot-formatter"
import { ProgressFormatter } from "./implementations/progress-formatter"
import { SummaryFormatter } from "./implementations/summary-formatter"
import * as events from "events"

/** Names defines the names of all built-in formatters */
export type Names = "detailed" | "dot" | "progress" | "silent" | "summary"

/** Formatter defines the interface that Formatters must implement. */
export interface Formatter {
  finish(args: FinishArgs): void
}

/** FinishArgs defines the arguments provided to the `finish` method. */
export interface FinishArgs {
  stats: Stats
}

/** creates an instance of the formatter with the given name */
export function instantiate(name: Names, sourceDir: string, emitter: events.EventEmitter): Formatter {
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
