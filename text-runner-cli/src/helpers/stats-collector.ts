import * as helpers from "."
import * as tr from "text-runner-core"

/** Statistics about a run of Text-Runner */
export interface Statistics {
  activityCount: number
  duration: string
  errorCount: number
  skipsCount: number
  successCount: number
}

/** StatsCollector provides statistics about the Text-Runner command it observes. */
export class StatsCollector {
  errorCount: number
  skipCount: number
  successCount: number
  stopWatch: helpers.StopWatch

  constructor(command: tr.commands.Command) {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.stopWatch = new helpers.StopWatch()
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    if (tr.events.instanceOfSuccess(result)) {
      this.onSuccess()
    } else if (tr.events.instanceOfSkipped(result)) {
      this.onSkip()
    } else if (tr.events.instanceOfFailed(result)) {
      this.onError()
    }
  }

  stats(): Statistics {
    return {
      activityCount: this.errorCount + this.skipCount + this.successCount,
      duration: this.stopWatch.duration(),
      errorCount: this.errorCount,
      skipsCount: this.skipCount,
      successCount: this.successCount,
    }
  }

  onError(): void {
    this.errorCount += 1
  }

  onSkip(): void {
    this.skipCount += 1
  }

  onSuccess(): void {
    this.successCount += 1
  }
}
