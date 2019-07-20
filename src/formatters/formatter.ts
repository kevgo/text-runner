import deb from "debug"
import humanize from "humanize-string"
import { Activity } from "../activity-list/activity"
import { StatsCounter } from "../runners/stats-counter"

const debug = deb("formatter")

/**
 * Base class for formatters
 */
export class Formatter {
  activity: Activity
  sourceDir: string
  statsCounter: StatsCounter
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
    this.output = ""
    this.title = humanize(activity.actionName)
    this.sourceDir = sourceDir
    this.skipped = false
    this.warned = false
  }

  error(errorMessage: string) {
    debug("error: " + errorMessage)
    this.statsCounter.error()
  }

  log(text: string | Buffer): boolean {
    this.output += text.toString()
    return false
  }

  skip(message: string) {
    debug("skipping: " + message)
    this.skipped = true
    this.statsCounter.skip()
  }

  success() {
    this.statsCounter.success()
  }

  /**
   * allows the user to set a new name for this step
   */
  name(newTitle: string) {
    this.title = newTitle
  }

  warning(warningMessage: string) {
    debug("warning: " + warningMessage)
    this.warned = true
    this.statsCounter.warning()
  }
}
