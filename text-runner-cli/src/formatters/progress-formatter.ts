import * as progress from "cli-progress"
import * as color from "colorette"
import * as tr from "text-runner-core"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"
import { printUserError } from "./print-user-error.js"

export class ProgressFormatter implements formatter.Formatter {
  private readonly progressBar: progress.Bar

  constructor(command: tr.commands.Command) {
    this.progressBar = new progress.Bar(
      {
        clearOnComplete: true,
        format: color.green(" {bar}") + " {percentage}% | ETA: {eta}s | {value}/{total}",
        hideCursor: undefined,
        stopOnComplete: true,
      },
      progress.Presets.shades_classic
    )
    command.on("start", this.start.bind(this))
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    if (tr.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (tr.events.instanceOfSkipped(result)) {
      this.progressBar.increment(1)
    } else if (tr.events.instanceOfSuccess(result)) {
      this.progressBar.increment(1)
    } else if (tr.events.instanceOfWarning(result)) {
      this.progressBar.increment(1)
    }
  }

  start(args: tr.events.Start): void {
    this.progressBar.start(args.stepCount, 0)
  }

  onFailed(args: tr.events.Failed): void {
    this.progressBar.stop()
    console.log()
    console.log()
    console.log(color.dim(args.output))
    if (tr.isUserError(args.error)) {
      printUserError(args.error)
    } else {
      console.log(
        color.red(
          `${args.activity.location.file.platformified()}:${args.activity.location.line} -- ${args.error.message}\n`
        )
      )
      console.log()
      helpers.printCodeFrame(console.log, args.activity.location)
    }
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }
}
