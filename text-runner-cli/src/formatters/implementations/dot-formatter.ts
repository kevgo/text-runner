import * as color from "colorette"
import * as path from "path"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { FinishArgs, Formatter } from "../formatter"
import * as events from "events"
import * as tr from "text-runner-core"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements Formatter {
  private readonly configuration: tr.Configuration

  constructor(configuration: tr.Configuration, emitter: events.EventEmitter) {
    this.configuration = configuration
    emitter.on(tr.CommandEvent.output, console.log)
    emitter.on(tr.CommandEvent.success, this.success.bind(this))
    emitter.on(tr.CommandEvent.failed, this.failed.bind(this))
    emitter.on(tr.CommandEvent.warning, this.warning.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.skipped.bind(this))
    emitter.on(tr.CommandEvent.finish, this.finish.bind(this))
  }

  failed(args: tr.FailedArgs) {
    console.log()
    console.log(color.dim(args.output))
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    printCodeFrame(
      console.log,
      path.join(this.configuration.sourceDir, args.activity.file.platformified()),
      args.activity.line
    )
  }

  skipped() {
    process.stdout.write(color.cyan("."))
  }

  success() {
    process.stdout.write(color.green("."))
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }

  warning(args: tr.WarnArgs) {
    console.log(color.magenta(args.message))
  }
}
