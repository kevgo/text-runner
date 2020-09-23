import * as color from "colorette"
import * as path from "path"
import * as helpers from "../helpers"
import * as formatter from "."
import * as events from "events"
import * as tr from "text-runner-core"

/** A formatter that prints output and step names */
export class DetailedFormatter implements formatter.Formatter {
  private readonly sourceDir: string

  constructor(sourceDir: string, emitter: events.EventEmitter) {
    this.sourceDir = sourceDir
    emitter.on(tr.events.CommandEvent.output, console.log)
    emitter.on(tr.events.CommandEvent.success, this.success.bind(this))
    emitter.on(tr.events.CommandEvent.failed, this.failed.bind(this))
    emitter.on(tr.events.CommandEvent.warning, this.warning.bind(this))
    emitter.on(tr.events.CommandEvent.skipped, this.skipped.bind(this))
  }

  success(args: tr.events.SuccessArgs): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(color.green(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.finalName}`))
  }

  failed(args: tr.events.FailedArgs): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    const filePath = path.join(this.sourceDir, args.activity.file.platformified())
    helpers.printCodeFrame(console.log, filePath, args.activity.line)
  }

  skipped(args: tr.events.SkippedArgs): void {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(`${args.activity.file.platformified()}:${args.activity.line} -- skipping: ${args.finalName}`)
    )
  }

  warning(args: tr.events.WarnArgs): void {
    console.log(color.magenta(args.message))
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.stats)
  }
}
