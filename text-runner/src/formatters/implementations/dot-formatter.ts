import * as color from "colorette"
import * as path from "path"
import { CommandEvent } from "../../commands/command"
import { Configuration } from "../../configuration/types/configuration"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { FailedArgs, FinishArgs, WarnArgs, Formatter } from "../formatter"
import { EventEmitter } from "events"
import { Counter } from "../counter"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements Formatter {
  private readonly configuration: Configuration
  readonly counter: Counter

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.counter = new Counter()
    this.configuration = configuration
    emitter.on(CommandEvent.output, console.log)
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skipped.bind(this))
    emitter.on(CommandEvent.finish, this.finish.bind(this))
  }

  failed(args: FailedArgs) {
    this.counter.failed()
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
    this.counter.skipped()
    process.stdout.write(color.cyan("."))
  }

  success() {
    this.counter.success()
    process.stdout.write(color.green("."))
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }

  warning(args: WarnArgs) {
    this.counter.warning()
    console.log(color.magenta(args.message))
  }

  errorCount(): number {
    return this.counter.errorCount()
  }
}
