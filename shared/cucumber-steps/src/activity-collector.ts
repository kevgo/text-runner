import * as tr from "text-runner-core"

/** Statistics about a run of Text-Runner */
export interface ActivityResult {
  activity?: tr.activities.Activity
  finalName?: string
  status: tr.events.ResultStatus
  output?: string
  error?: Error
  message?: string // warning message
}

/** StatsCollector provides statistics about the Text-Runner command it observes. */
export class ActivityCollector {
  activities: ActivityResult[]

  constructor(command: tr.commands.Command) {
    this.activities = []
    command.on("result", this.onResult.bind(this))
  }

  onResult(result: tr.events.Result): void {
    this.activities.push(result)
  }

  results(): ActivityResult[] {
    return this.activities
  }
}
