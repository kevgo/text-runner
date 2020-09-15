import { Stats } from "../helpers/stats-collector"

export type FormatterName = "detailed" | "dot" | "progress" | "silent" | "summary"

export interface Formatter {
  finish(args: FinishArgs): void
}

export interface FinishArgs {
  stats: Stats
}
