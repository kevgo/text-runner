import { Activity } from "../activity-list/activity"
import WriteStream from "observable-process"

import humanize from "humanize-string"
import StatsCounter from "../runners/stats-counter"

type Console = {
  log(text: string): void
}

// Base class for formatters
export default abstract class Formatter {
  activity: Activity
  console: Console
  sourceDir: string
  statsCounter: StatsCounter
  stderr: WriteStream
  stdout: WriteStream
  output: string
  title: string
  skipped: boolean
  // TODO: remove this?
  warned: boolean

  constructor(
    activity: Activity,
    sourceDir: string,
    statsCounter: StatsCounter
  ) {
    this.activity = activity
    this.statsCounter = statsCounter
    this.stdout = { write: this.log.bind(this) }
    this.stderr = { write: this.log.bind(this) }
    this.output = ""
    this.title = humanize(activity.type)
    this.sourceDir = sourceDir
    this.skipped = false
    this.warned = false
    this.console = {
      log: text => this.stdout.write(text + "\n")
    }
  }

  abstract error(errorMessage: string)

  registerError() {
    this.statsCounter.error()
  }

  log(text: string | Buffer): boolean {
    this.output += text.toString()
    return false
  }

  abstract skip(message: string)

  registerSkip() {
    this.skipped = true
    this.statsCounter.skip()
  }

  success() {
    this.statsCounter.success()
  }

  // allows the user to set a new name for this step
  name(newTitle: string) {
    this.title = newTitle
  }

  abstract warning(warningMessage: string)

  registerWarning() {
    this.warned = true
    this.statsCounter.warning()
  }
}
