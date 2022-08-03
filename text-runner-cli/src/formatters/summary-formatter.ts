import * as color from "colorette"
import * as tr from "text-runner-core"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"

/** An extremely minimalistic formatter, prints only a summary at the end */
export class SummaryFormatter implements formatter.Formatter {
  constructor(command: tr.commands.Command) {
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    if (tr.events.instanceOfFailed(result)) {
      this.onFailed(result)
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
