import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"
import * as formatter from "."
import * as events from "events"
import { printCodeFrame } from "../helpers/print-code-frame"

/** An extremely minimalistic formatter, prints only a summary at the end */
export class SummaryFormatter implements formatter.Formatter {
  private readonly sourceDir: string

  constructor(sourceDir: string, emitter: events.EventEmitter) {
    this.sourceDir = sourceDir
    emitter.on(tr.CommandEvent.output, console.log)
    emitter.on(tr.CommandEvent.failed, this.failed.bind(this))
  }

  // @ts-ignore: okay to not use parameters here
  failed(args: FailedArgs) {
    console.log()
    console.log(color.dim(args.output))
    process.stdout.write(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- `))
    console.log(args.error.message)
    printCodeFrame(console.log, path.join(this.sourceDir, args.activity.file.platformified()), args.activity.line)
  }

  finish(args: formatter.FinishArgs) {
    formatter.printSummary(args.stats)
  }
}
