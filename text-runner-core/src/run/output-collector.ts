import * as util from "util"

import * as run from "./index"

/** simulates console.log to collect output from a running action */
export class OutputCollector {
  /** collects the received output */
  content: string[] = []

  /** appends to the output with a newline */
  log(...args: any[]): void {
    const stringified: string[] = []
    for (const arg of args) {
      if (typeof arg === "string") {
        stringified.push(arg)
      } else {
        stringified.push(util.inspect(arg))
      }
    }
    this.content.push(stringified.join(" ") + "\n")
  }

  /** returns the "log" function to be used by actions */
  logFn(): run.LogFn {
    return this.log.bind(this)
  }

  /** returns the currently accumulated output */
  toString(): string {
    return this.content.join("")
  }
}
