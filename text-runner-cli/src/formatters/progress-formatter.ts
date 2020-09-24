import * as progress from "cli-progress"
import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"
import * as helpers from "../helpers"
import * as formatter from "."

export class ProgressFormatter implements formatter.Formatter {
  private readonly sourceDir: string
  private readonly progressBar: progress.Bar

  constructor(sourceDir: string, command: tr.commands.Command) {
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
    command.on("start", this.start.bind(this))
    command.on("output", console.log)
    command.on("success", this.success.bind(this))
    command.on("failed", this.failed.bind(this))
    command.on("warning", this.warning.bind(this))
    command.on("skipped", this.skipped.bind(this))
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
