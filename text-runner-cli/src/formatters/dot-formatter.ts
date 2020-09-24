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
    command.on("success", this.success.bind(this))
    command.on("failed", this.failed.bind(this))
    command.on("warning", this.warning.bind(this))
    command.on("skipped", this.skipped.bind(this))
    command.on("finish", this.finish.bind(this))
  }

  failed(args: tr.events.FailedArgs): void {
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

  skipped(): void {
    process.stdout.write(color.cyan("."))
  }

  success(): void {
    process.stdout.write(color.green("."))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.stats)
  }

  warning(args: tr.events.WarnArgs): void {
    console.log(color.magenta(args.message))
  }
}
