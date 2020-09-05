import * as color from "colorette"
import * as path from "path"
import { Configuration } from "../../configuration/types/configuration"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { CommandEvent } from "../../commands/command"
import { FinishArgs, FailedArgs } from "../formatter"
import { EventEmitter } from "events"
import { Counter } from "../counter"

/** An extremely minimalistic formatter, prints only a summary at the end */
export class SummaryFormatter {
  private readonly configuration: Configuration
  readonly counter: Counter

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.configuration = configuration
    this.counter = new Counter()
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skipped.bind(this))
    emitter.on(CommandEvent.finish, this.finish.bind(this))
  }

  success() {
    this.counter.success()
  }

  // @ts-ignore: okay to not use parameters here
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
    this.counter.skipped()
  }

  warning() {
    this.counter.warning()
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }

  errorCount(): number {
    return this.counter.errorCount()
  }
}
