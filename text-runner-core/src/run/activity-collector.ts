import { Activity } from "../activities/index.js"
import { Command } from "../commands/index.js"
import * as events from "../events/index.js"
import { StopWatch } from "./stopwatch.js"

/** Statistics about a run of Text-Runner */
interface ActivityResult {
  readonly activity?: Activity
  readonly error?: Error
  readonly finalName?: string
  readonly message?: string // warning message
  readonly output?: string
  readonly status: events.ResultStatus
}

/** ActivityCollector provides statistics about the Text-Runner command it observes. */
export class ActivityCollector {
  activities: ActivityResult[]
  stopWatch: StopWatch

  constructor(command: Command) {
    this.activities = []
    this.stopWatch = new StopWatch()
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: events.Result): void {
    this.activities.push(result)
  }

  results(): ActivityResults {
    return new ActivityResults(this.activities, this.stopWatch.duration())
  }
}

export class ActivityResults extends Array<ActivityResult> {
  readonly duration: string

  constructor(results: Array<ActivityResult>, duration: string) {
    super()
    this.push(...results)
    this.duration = duration
  }

  errorCount(): number {
    return this.errors().length
  }

  errors(): Error[] {
    const result = []
    for (const res of this) {
      if (res.error) {
        result.push(res.error)
      }
    }
    return result
  }
}
