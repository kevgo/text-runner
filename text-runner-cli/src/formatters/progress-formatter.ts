import * as progress from "cli-progress"
import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"
import { printUserError } from "./print-user-error.js"

export class ProgressFormatter implements formatter.Formatter {
  private readonly progressBar: progress.Bar

  constructor(command: textRunner.commands.Command) {
    this.progressBar = new progress.Bar(
      {
        clearOnComplete: true,
        format: styleText("green", " {bar}") + " {percentage}% | ETA: {eta}s | {value}/{total}",
        hideCursor: undefined,
        stopOnComplete: true
      },
      progress.Presets.shades_classic
    )
    command.on("start", this.start.bind(this))
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }

  onFailed(args: textRunner.events.Failed): void {
    this.progressBar.stop()
    console.log()
    console.log()
    console.log(styleText("dim", args.output))
    if (textRunner.isUserError(args.error)) {
      printUserError(args.error)
    } else {
      console.log(
        styleText("red",
          `${args.activity.location.file.platformified()}:${args.activity.location.line} -- ${args.error.message}\n`
        )
      )
      console.log()
      helpers.printCodeFrame(console.log, args.activity.location)
    }
  }

  onResult(result: textRunner.events.Result): void {
    if (textRunner.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (textRunner.events.instanceOfSkipped(result)) {
      this.progressBar.increment(1)
    } else if (textRunner.events.instanceOfSuccess(result)) {
      this.progressBar.increment(1)
    } else if (textRunner.events.instanceOfWarning(result)) {
      this.progressBar.increment(1)
    }
  }

  start(args: textRunner.events.Start): void {
    this.progressBar.start(args.stepCount, 0)
  }
}
