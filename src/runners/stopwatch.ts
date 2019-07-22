export class StopWatch {
  /** the time when this StopWatch was started */
  startTime: number

  constructor() {
    this.startTime = new Date().getTime()
  }

  duration(): string {
    const endTime = new Date().getTime()
    const difference = endTime - this.startTime
    console.log(difference)
    return ""
  }
}
