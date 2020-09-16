import * as color from "colorette"
import * as path from "path"
import { printCodeFrame } from "../../helpers/print-code-frame"
import { printSummary } from "../print-summary"
import { FinishArgs, Formatter } from "../formatter"
import * as events from "events"
import * as tr from "text-runner-core"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  private readonly configuration: tr.Configuration

  constructor(configuration: tr.Configuration, emitter: events.EventEmitter) {
    this.configuration = configuration
    emitter.on(tr.CommandEvent.output, console.log)
    emitter.on(tr.CommandEvent.success, this.success.bind(this))
    emitter.on(tr.CommandEvent.failed, this.failed.bind(this))
    emitter.on(tr.CommandEvent.warning, this.warning.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.skipped.bind(this))
  }

  success(args: tr.SuccessArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(color.green(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.finalName}`))
  }

  failed(args: tr.FailedArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    const filePath = path.join(this.configuration.sourceDir, args.activity.file.platformified())
    printCodeFrame(console.log, filePath, args.activity.line)
  }

  skipped(args: tr.SkippedArgs) {
    if (args.output !== "") {
      process.stdout.write(color.dim(args.output))
    }
    console.log(
      color.cyan(`${args.activity.file.platformified()}:${args.activity.line} -- skipping: ${args.finalName}`)
    )
  }

  warning(args: tr.WarnArgs) {
    console.log(color.magenta(args.message))
  }

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }
}
