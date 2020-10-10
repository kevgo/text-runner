import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"

import * as helpers from "../helpers"
import * as formatter from "."
import { printUserError } from "./print-user-error"

/** A formatter that prints output and step names */
export class DetailedFormatter implements formatter.Formatter {
  private readonly sourceDir: string

  constructor(sourceDir: string, command: tr.commands.Command) {
    this.sourceDir = sourceDir
    command.on("output", console.log)
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    if (tr.events.instanceOfFailed(result)) {
      this.onFailed(result)
    } else if (tr.events.instanceOfSkipped(result)) {
      this.onSkipped(result)
    } else if (tr.events.instanceOfSuccess(result)) {
      this.onSuccess(result)
    } else if (tr.events.instanceOfWarning(result)) {
      this.onWarning(result)
    }
  }

  onSuccess(args: tr.events.Success): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.green(`${args.activity.location.file.platformified()}:${args.activity.location.line} -- ${args.finalName}`)
    )
  }

  onFailed(args: tr.events.Failed): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    if (tr.instanceOfUserError(args.error)) {
      printUserError(args.error)
    } else {
      process.stdout.write(
        color.red(`${args.activity.location.file.platformified()}:${args.activity.location.line} -- `)
      )
      console.log(args.error.message)
      const filePath = path.join(this.sourceDir, args.activity.location.file.platformified())
      helpers.printCodeFrame(console.log, filePath, args.activity.location.line)
    }
  }

  onSkipped(args: tr.events.Skipped): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(
        `${args.activity.location.file.platformified()}:${args.activity.location.line} -- skipping: ${args.finalName}`
      )
    )
  }

  onWarning(args: tr.events.Warning): void {
    console.log(color.magenta(args.message))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.results)
  }
}
