import * as util from "util"
import { LogFn } from "../types/log-function"

/** simulates console.log to collect output from a running action */
export class OutputCollector {
  /** collects the received output */
  content: string[] = []

  /** appends to the output with a newline */
  // @ts-ignore
  log(message?: any, ...optionalParams: any[]) {
    const stringified: string[] = []
    for (const arg of arguments) {
      if (typeof arg === "string") {
        stringified.push(arg)
      } else {
        stringified.push(util.inspect(arg))
      }
    }
    this.content.push(stringified.join(" ") + "\n")
  }

  /** returns the "log" function to be used by actions */
  logFn(): LogFn {
    return this.log.bind(this)
  }

  /** returns the currently accumulated output */
  toString(): string {
    return this.content.join("")
  }
}
