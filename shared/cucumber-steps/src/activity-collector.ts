import * as tr from "text-runner-core"

/** Statistics about a run of Text-Runner */
export interface ActivityResult {
  activity?: tr.Activity
  finalName?: string
  status: "success" | "failed" | "skipped" | "warning"
  output?: string
  error?: Error
  message?: string // warning message
}

/** StatsCollector provides statistics about the Text-Runner command it observes. */
export class ActivityCollector {
  activities: ActivityResult[]

  constructor(command: tr.commands.Command) {
    this.activities = []
    command.on("failed", this.onFailure.bind(this))
    command.on("skipped", this.onSkipped.bind(this))
    command.on("success", this.onSuccess.bind(this))
    command.on("warning", this.onWarning.bind(this))
  }

  results(): ActivityResult[] {
    return this.activities
  }

  onFailure(args: tr.events.FailedArgs): void {
    this.activities.push({ ...args, status: "failed" })
  }

  onSkipped(args: tr.events.SkippedArgs): void {
    this.activities.push({ ...args, status: "skipped" })
  }

  onSuccess(args: tr.events.SuccessArgs): void {
    this.activities.push({ ...args, status: "success" })
  }

  onWarning(args: tr.events.WarnArgs): void {
    this.activities.push({ ...args, status: "warning" })
  }
}
