import * as color from "colorette"
import * as path from "path"
import * as helpers from "../helpers"
import * as formatter from "."
import * as tr from "text-runner-core"

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
    console.log(color.green(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.finalName}`))
  }

  onFailed(args: tr.events.Failed): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    const filePath = path.join(this.sourceDir, args.activity.file.platformified())
    helpers.printCodeFrame(console.log, filePath, args.activity.line)
  }

  onSkipped(args: tr.events.Skipped): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(`${args.activity.file.platformified()}:${args.activity.line} -- skipping: ${args.finalName}`)
    )
  }

  onWarning(args: tr.events.Warning): void {
    console.log(color.magenta(args.message))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.stats)
  }
}
