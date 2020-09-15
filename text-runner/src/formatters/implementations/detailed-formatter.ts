import * as color from "colorette"
import * as path from "path"
import { Configuration } from "../../configuration/configuration"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { CommandEvent } from "../../commands/command"
import { FailedArgs, SkippedArgs, SuccessArgs, WarnArgs, FinishArgs, Formatter } from "../formatter"
import { EventEmitter } from "events"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  private readonly configuration: Configuration

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.configuration = configuration
    emitter.on(CommandEvent.output, console.log)
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skipped.bind(this))
  }

  success(args: SuccessArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(color.green(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.finalName}`))
  }

  failed(args: FailedArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    const filePath = path.join(this.configuration.sourceDir, args.activity.file.platformified())
    printCodeFrame(console.log, filePath, args.activity.line)
  }

  skipped(args: SkippedArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(`${args.activity.file.platformified()}:${args.activity.line} -- skipping: ${args.finalName}`)
    )
  }

  warning(args: WarnArgs) {
    console.log(color.magenta(args.message))
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }
}
