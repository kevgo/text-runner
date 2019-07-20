import color from "colorette"
import humanize from "humanize-string"
import path from "path"
import { Activity } from "../activity-list/activity"
import { printCodeFrame } from "../helpers/print-code-frame"
import { StatsCounter } from "../runners/stats-counter"
import { Formatter } from "./formatter"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements Formatter {
  /** the activity whose progess this formatter describes to the user */
  activity: Activity

  /** the directory in which the sources are located */
  // TODO: replace with configuration
  sourceDir: string

  /** the title of the current test step */
  stepName: string

  /** link to the global stats counter */
  statsCounter: StatsCounter

  /** the accumulated output from the test */
  output: string[]

  constructor(
    activity: Activity,
    sourceDir: string,
    statsCounter: StatsCounter
  ) {
    this.activity = activity
    this.sourceDir = sourceDir
    this.stepName = humanize(activity.actionName)
    this.statsCounter = statsCounter
    this.output = []
  }

  failed(err: Error) {
    console.log()
    console.log(color.dim(this.output.join("")))
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(err.message)
    printCodeFrame(
      console.log,
      path.join(this.sourceDir, this.activity.file.platformified()),
      this.activity.line
    )
  }

  log(text: string) {
    this.output.push(text)
  }

  // @ts-ignore: okay to not use the message here
  skipped(message: string) {
    process.stdout.write(color.cyan("."))
  }

  success() {
    process.stdout.write(color.green("."))
  }

  name(text: string) {
    this.stepName = text
  }

  // @ts-ignore: okay to not use the message here
  warning(warningMessage: string) {
    process.stdout.write(color.magenta("."))
  }
}
