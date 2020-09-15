import * as color from "colorette"
import * as path from "path"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { FinishArgs, Formatter } from "../formatter"
import { EventEmitter } from "events"
import { Configuration, FailedArgs, WarnArgs, CommandEvent } from "@text-runner/core"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements Formatter {
  private readonly configuration: Configuration

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.configuration = configuration
    emitter.on(CommandEvent.output, console.log)
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skipped.bind(this))
    emitter.on(CommandEvent.finish, this.finish.bind(this))
  }

  failed(args: FailedArgs) {
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

  warning(args: WarnArgs) {
    console.log(color.magenta(args.message))
  }
}
