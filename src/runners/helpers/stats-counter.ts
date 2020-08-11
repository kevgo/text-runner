import { StopWatch } from "./stopwatch"

export class StatsCounter {
  errorCount: number
  skipCount: number
  successCount: number
  stopWatch: StopWatch

  constructor() {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.stopWatch = new StopWatch()
  }

  duration() {
    return this.stopWatch.duration()
  }

  error() {
    this.errorCount += 1
  }

  errors(): number {
    return this.errorCount
  }

  skip() {
    this.skipCount += 1
  }

  skips(): number {
    return this.skipCount
  }

  success() {
    this.successCount += 1
  }

  successes(): number {
    return this.successCount
  }
}
