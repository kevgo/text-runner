// @flow

const Time = require('time-diff')

module.exports = class StatsCounter {
  errorCount: number
  skipCount: number
  successCount: number
  warningCount: number
  time: Time

  constructor () {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.warningCount = 0
    this.time = new Time()
    this.time.start('formatter')
  }

  duration () {
    return this.time.end('formatter')
  }

  error () {
    this.errorCount += 1
  }

  errors (): number {
    return this.errorCount
  }

  skip () {
    this.skipCount += 1
  }

  skips (): number {
    return this.skipCount
  }

  success () {
    this.successCount += 1
  }

  successes (): number {
    return this.successCount
  }

  warning () {
    this.warningCount += 1
  }

  warnings (): number {
    return this.warningCount
  }
}
