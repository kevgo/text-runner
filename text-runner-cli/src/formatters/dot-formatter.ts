import * as color from "colorette"
import * as path from "path"
import * as formatter from "."
import * as tr from "text-runner-core"
import * as helpers from "../helpers"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements formatter.Formatter {
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
      this.onSkipped()
    } else if (tr.events.instanceOfSuccess(result)) {
      this.onSuccess()
    } else if (tr.events.instanceOfWarning(result)) {
      this.onWarning(result)
    }
  }

  onFailed(args: tr.events.Failed): void {
    console.log()
    console.log(color.dim(args.output))
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    helpers.printCodeFrame(
      console.log,
      path.join(this.sourceDir, args.activity.file.platformified()),
      args.activity.line
    )
  }

  onSkipped(): void {
    process.stdout.write(color.cyan("."))
  }

  onSuccess(): void {
    process.stdout.write(color.green("."))
  }

  onWarning(args: tr.events.Warning): void {
    console.log(color.magenta(args.message))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.stats)
  }
}
