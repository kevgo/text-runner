import * as color from "colorette"
import * as path from "path"
import { Configuration, FailedArgs } from "text-runner-core"
import { printSummary } from "../print-summary"
import { CommandEvent } from "text-runner-core"
import { FinishArgs, Formatter } from "../formatter"
import { EventEmitter } from "events"
import { printCodeFrame } from "../../helpers/print-code-frame"

/** An extremely minimalistic formatter, prints only a summary at the end */
export class SummaryFormatter implements Formatter {
  private readonly configuration: Configuration

  constructor(configuration: Configuration, emitter: EventEmitter) {
    this.configuration = configuration
    emitter.on(CommandEvent.output, console.log)
    emitter.on(CommandEvent.failed, this.failed.bind(this))
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

  finish(args: FinishArgs) {
    printSummary(args.stats)
  }
}
