import * as color from "colorette"
import * as path from "path"
import * as formatter from "."
import * as events from "events"
import * as tr from "text-runner-core"
import * as helpers from "../helpers"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements formatter.Formatter {
  private readonly sourceDir: string

  constructor(sourceDir: string, emitter: events.EventEmitter) {
    this.sourceDir = sourceDir
    emitter.on(tr.CommandEvent.output, console.log)
    emitter.on(tr.CommandEvent.success, this.success.bind(this))
    emitter.on(tr.CommandEvent.failed, this.failed.bind(this))
    emitter.on(tr.CommandEvent.warning, this.warning.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.skipped.bind(this))
    emitter.on(tr.CommandEvent.finish, this.finish.bind(this))
  }

  failed(args: tr.FailedArgs): void {
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

  warning(args: tr.WarnArgs): void {
    console.log(color.magenta(args.message))
  }
}
