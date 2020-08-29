import { StopWatch } from "./stopwatch"

export class StatsCounter {
  errorCount: number
  filesCount: number
  skipCount: number
  successCount: number
  stopWatch: StopWatch

  constructor(filesCount: number) {
    this.errorCount = 0
    this.filesCount = filesCount
    this.skipCount = 0
    this.successCount = 0
    this.stopWatch = new StopWatch()
  }

  activities() {
    return this.errorCount + this.skipCount + this.successCount
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

  files(): number {
    return this.filesCount
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
