import { Activity } from "../activities"
import { Command } from "../commands"
import * as events from "../events"
import { StopWatch } from "./stopwatch"

/** Statistics about a run of Text-Runner */
interface ActivityResult {
  activity?: Activity
  error?: Error
  finalName?: string
  message?: string // warning message
  output?: string
  status: events.ResultStatus
}

export class ActivityResults extends Array<ActivityResult> {
  readonly duration: string

  constructor(results: Array<ActivityResult>, duration: string) {
    super()
    this.push(...results)
    this.duration = duration
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

  errorCount(): number {
    return this.errors().length
  }
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
