import * as color from "colorette"
import * as path from "path"
import { Configuration } from "../../configuration/types/configuration"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { CommandEvent } from "../../commands/command"
import { FailedArgs, SkippedArgs, SuccessArgs, WarnArgs, FinishArgs, Formatter } from "../formatter"
import { EventEmitter } from "events"
import { Counter } from "../counter"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  private readonly configuration: Configuration
  readonly counter: Counter

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.counter = new Counter()
    this.configuration = configuration
    emitter.on(CommandEvent.success, this.success)
    emitter.on(CommandEvent.failed, this.failed)
    emitter.on(CommandEvent.warning, this.warning)
    emitter.on(CommandEvent.skipped, this.skipped)
    emitter.on(CommandEvent.finish, this.finish)
  }

  success(args: SuccessArgs) {
    this.counter.success()
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.green(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.activity.actionName}`)
    )
  }

  failed(args: FailedArgs) {
    this.counter.failed()
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    const filePath = path.join(this.configuration.sourceDir, args.activity.file.platformified())
    printCodeFrame(console.log, filePath, args.activity.line)
  }

  skipped(args: SkippedArgs) {
    this.counter.skipped()
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(`${args.activity.file.platformified()}:${args.activity.line} -- skipping: ${args.activity.actionName}`)
    )
  }

  warning(args: WarnArgs) {
    this.counter.warning()
    console.log(color.magenta(args.message))
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }

  errorCount(): number {
    return this.errorCount()
  }
}
