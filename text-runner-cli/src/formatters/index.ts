import * as textRunner from "text-runner-core"

export { instantiate } from "./instantiate.js"
export { printSummary } from "./print-summary.js"
export { printUserError } from "./print-user-error.js"

/** FinishArgs defines the arguments provided to the `finish` method. */
export interface FinishArgs {
  readonly results: textRunner.ActivityResults
}

/** Formatter defines the interface that Formatters must implement. */
export interface Formatter {
  finish(args: FinishArgs): void
}

/** Names defines the names of all built-in formatters */
export type Names = "detailed" | "dot" | "progress" | "summary"
