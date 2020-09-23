import * as progress from "cli-progress"
import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"
import * as helpers from "../helpers"
import * as formatter from "."
import * as events from "events"

export class ProgressFormatter implements formatter.Formatter {
  private readonly sourceDir: string
  private readonly progressBar: progress.Bar

  constructor(sourceDir: string, emitter: events.EventEmitter) {
    this.sourceDir = sourceDir
    this.progressBar = new progress.Bar(
      {
        clearOnComplete: true,
        format: color.green(" {bar}") + " {percentage}% | ETA: {eta}s | {value}/{total}",
        hideCursor: undefined,
        stopOnComplete: true,
      },
      progress.Presets.shades_classic
    )
    emitter.on(tr.events.CommandEvent.start, this.start.bind(this))
    emitter.on(tr.events.CommandEvent.output, console.log)
    emitter.on(tr.events.CommandEvent.success, this.success.bind(this))
    emitter.on(tr.events.CommandEvent.failed, this.failed.bind(this))
    emitter.on(tr.events.CommandEvent.warning, this.warning.bind(this))
    emitter.on(tr.events.CommandEvent.skipped, this.skipped.bind(this))
  }

  start(args: tr.events.StartArgs): void {
    this.progressBar.start(args.stepCount, 0)
  }

  failed(args: tr.events.FailedArgs): void {
    this.progressBar.stop()
    console.log()
    console.log()
    console.log(color.dim(args.output))
    console.log(color.red(`${args.activity.file.platformified()}:${args.activity.line} -- ${args.error.message}\n`))
    console.log()
    helpers.printCodeFrame(
      console.log,
      path.join(this.sourceDir, args.activity.file.platformified()),
      args.activity.line
    )
  }

  skipped(): void {
    this.progressBar.increment(1)
  }

  success(): void {
    this.progressBar.increment(1)
  }

  warning(): void {
    this.progressBar.increment(1)
  }

  finish(args: formatter.FinishArgs): void {
    formatter.printSummary(args.stats)
  }
}
