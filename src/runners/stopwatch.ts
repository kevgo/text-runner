export class StopWatch {
  /** the time when this StopWatch was started */
  private startTime: number

  constructor() {
    this.startTime = new Date().getTime()
  }

  duration(): string {
    const endTime = new Date().getTime()
    const milliseconds = endTime - this.startTime
    if (milliseconds > 1000) {
      return `${Math.round(milliseconds / 1000)}s`
    }
    return `${milliseconds}ms`
  }
}
