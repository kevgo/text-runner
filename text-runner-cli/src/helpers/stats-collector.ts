import { StopWatch } from "./stopwatch"
import { EventEmitter } from "events"
import { CommandEvent } from "text-runner-core"

/** Statistics about a run of Text-Runner */
export interface Stats {
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
  stopWatch: StopWatch

  constructor(emitter: EventEmitter) {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.stopWatch = new StopWatch()
    emitter.on(CommandEvent.failed, this.onError.bind(this))
    emitter.on(CommandEvent.skipped, this.onSkip.bind(this))
    emitter.on(CommandEvent.success, this.onSuccess.bind(this))
  }

  stats(): Stats {
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
