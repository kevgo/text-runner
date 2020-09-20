import * as helpers from "../helpers"
export * as formatters from "."
export { printSummary } from "./print-summary"
export { printUserError } from "./print-user-error"
export { instantiate } from "./instantiate"

/** Names defines the names of all built-in formatters */
export type Names = "detailed" | "dot" | "progress" | "silent" | "summary"

/** Formatter defines the interface that Formatters must implement. */
export interface Formatter {
  finish(args: FinishArgs): void
}

/** FinishArgs defines the arguments provided to the `finish` method. */
export interface FinishArgs {
  stats: helpers.stats.Data
}
