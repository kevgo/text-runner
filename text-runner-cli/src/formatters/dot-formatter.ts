import * as color from "colorette"
import * as textRunner from "text-runner-core"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements formatter.Formatter {
  constructor(command: textRunner.commands.Command) {
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: textRunner.events.Result): void {
    if (textRunner.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (textRunner.events.instanceOfSkipped(result)) {
      process.stdout.write(color.cyan("."))
    } else if (textRunner.events.instanceOfSuccess(result)) {
      process.stdout.write(color.green("."))
    } else if (textRunner.events.instanceOfWarning(result)) {
      console.log(color.magenta(result.message))
    }
  }

  onFailed(args: textRunner.events.Failed): void {
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
