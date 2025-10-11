import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"
import { printUserError } from "./print-user-error.js"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements formatter.Formatter {
  constructor(command: textRunner.commands.Command) {
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }

  onFailed(args: textRunner.events.Failed): void {
    console.log()
    if (textRunner.isUserError(args.error)) {
      printUserError(args.error)
    } else {
      process.stdout.write(
        styleText("red", `${args.activity.location.file.platformified()}:${args.activity.location.line} -- `)
      )
      console.log(args.error.message)
      helpers.printCodeFrame(console.log, args.activity.location)
    }
  }

  onResult(result: textRunner.events.Result): void {
    if (textRunner.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (textRunner.events.instanceOfSkipped(result)) {
      process.stdout.write(styleText("cyan", "."))
    } else if (textRunner.events.instanceOfSuccess(result)) {
      process.stdout.write(styleText("green", "."))
    } else if (textRunner.events.instanceOfWarning(result)) {
      console.log(styleText("magenta", result.message))
    }
  }
}
