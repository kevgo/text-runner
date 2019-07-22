/** StopWatch allows to measure the difference between time periods */
export class StopWatch {
  /** the time when this StopWatch was started */
  private startTime: number

  constructor() {
    this.startTime = new Date().getTime()
  }

  /**
   * Duration returns a human-readable description of the difference
   * between the current time and when this StopWatch was created.
   */
  duration(): string {
    const endTime = new Date().getTime()
    const milliseconds = endTime - this.startTime
    if (milliseconds > 1000) {
      return `${Math.round(milliseconds / 1000)}s`
    }
    return `${milliseconds}ms`
  }
}
