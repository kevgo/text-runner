import * as tr from "text-runner-core"

/** Statistics about a run of Text-Runner */
export interface ActivityResult {
  activity?: tr.activities.Activity
  error?: Error
  finalName?: string
  message?: string // warning message
  output?: string
  status: tr.events.ResultStatus
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
