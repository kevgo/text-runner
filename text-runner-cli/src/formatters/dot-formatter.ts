import * as color from "colorette"
import * as tr from "text-runner-core"

import * as helpers from "../helpers.js"
import * as formatter from "."

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements formatter.Formatter {
  constructor(command: tr.commands.Command) {
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    if (tr.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (tr.events.instanceOfSkipped(result)) {
      process.stdout.write(color.cyan("."))
    } else if (tr.events.instanceOfSuccess(result)) {
      process.stdout.write(color.green("."))
    } else if (tr.events.instanceOfWarning(result)) {
      console.log(color.magenta(result.message))
    }
  }

  onFailed(args: tr.events.Failed): void {
    console.log()
    console.log(color.dim(args.output))
    process.stdout.write(color.red(`${args.activity.location.file.platformified()}:${args.activity.location.line} -- `))
    console.log(args.error.message)
    helpers.printCodeFrame(console.log, args.activity.location)
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }
}
