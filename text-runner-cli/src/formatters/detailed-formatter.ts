import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import * as helpers from "../helpers/index.js"
import * as formatter from "./index.js"
import { printUserError } from "./print-user-error.js"

/** A formatter that prints output and step names */
export class DetailedFormatter implements formatter.Formatter {
  constructor(command: textRunner.commands.Command) {
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }

  onFailed(args: textRunner.events.Failed): void {
    if (args.output !== "") {
      process.stdout.write(styleText("dim", args.output))
    }
    if (textRunner.isUserError(args.error)) {
      printUserError(args.error)
    } else {
      process.stdout.write(
        styleText("red",`${args.activity.location.file.platformified()}:${args.activity.location.line} -- `)
      )
      console.log(args.error.message)
      helpers.printCodeFrame(console.log, args.activity.location)
    }
  }

  onResult(result: textRunner.events.Result): void {
    if (textRunner.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (textRunner.events.instanceOfSkipped(result)) {
      this.onSkipped(result)
    } else if (textRunner.events.instanceOfSuccess(result)) {
      this.onSuccess(result)
    } else if (textRunner.events.instanceOfWarning(result)) {
      this.onWarning(result)
    }
  }

  onSkipped(args: textRunner.events.Skipped): void {
    if (args.output !== "") {
      process.stdout.write(styleText("dim", args.output))
    }
    console.log(
      styleText("cyan",
        `${args.activity.location.file.platformified()}:${args.activity.location.line} -- skipping: ${args.finalName}`
      )
    )
  }

  onSuccess(args: textRunner.events.Success): void {
    if (args.output !== "") {
      process.stdout.write(styleText("dim",args.output))
    }
    console.log(
      styleText("green",`${args.activity.location.file.platformified()}:${args.activity.location.line} -- ${args.finalName}`)
    )
  }

  onWarning(args: textRunner.events.Warning): void {
    console.log(styleText("magenta", args.message))
  }
}
