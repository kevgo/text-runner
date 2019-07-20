import color from "colorette"
import humanize from "humanize-string"
import path from "path"
import { Activity } from "../activity-list/activity"
import { printCodeFrame } from "../helpers/print-code-frame"
import { StatsCounter } from "../runners/stats-counter"
import { Formatter } from "./formatter"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  /** the activity whose progess this formatter describes to the user */
  activity: Activity

  /** the directory in which the sources are located */
  // TODO: replace with configuration
  sourceDir: string

  /** the title of the current test step */
  stepName: string

  /** link to the global stats counter */
  statsCounter: StatsCounter

  constructor(
    activity: Activity,
    sourceDir: string,
    statsCounter: StatsCounter
  ) {
    this.activity = activity
    this.sourceDir = sourceDir
    this.stepName = humanize(activity.actionName)
    this.statsCounter = statsCounter
  }

  error(e: Error) {
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(e.message)
    const filePath = path.join(
      this.sourceDir,
      this.activity.file.platformified()
    )
    printCodeFrame(console.log, filePath, this.activity.line)
    this.statsCounter.error()
  }

  log(text: string) {
    console.log(color.dim(text))
  }

  skip(message: string) {
    console.log(
      color.cyan(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${message}`
      )
    )
    this.statsCounter.skip()
  }

  success() {
    console.log(
      color.green(
        `${this.activity.file.platformified()}:${this.activity.line} -- ${
          this.name
        }`
      )
    )
    this.statsCounter.success()
  }

  name(text: string) {
    this.stepName = text
  }

  warning(warningMessage: string) {
    console.log(
      color.magenta(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${warningMessage}`
      )
    )
    this.statsCounter.warning()
  }
}
