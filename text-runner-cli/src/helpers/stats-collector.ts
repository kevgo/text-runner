import * as helpers from "."
import * as events from "events"
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

  constructor(emitter: events.EventEmitter) {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.stopWatch = new helpers.StopWatch()
    emitter.on(tr.CommandEvent.failed, this.onError.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.onSkip.bind(this))
    emitter.on(tr.CommandEvent.success, this.onSuccess.bind(this))
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

  onError() {
    this.errorCount += 1
  }

  onSkip() {
    this.skipCount += 1
  }

  onSuccess() {
    this.successCount += 1
  }
}
