import * as events from "events"
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

  constructor(emitter: events.EventEmitter) {
    this.activities = []
    emitter.on(tr.CommandEvent.failed, this.onFailure.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.onSkipped.bind(this))
    emitter.on(tr.CommandEvent.success, this.onSuccess.bind(this))
    emitter.on(tr.CommandEvent.warning, this.onWarning.bind(this))
  }

  results(): ActivityResult[] {
    return this.activities
  }

  onFailure(args: tr.FailedArgs) {
    this.activities.push({ ...args, status: "failed" })
  }

  onSkipped(args: tr.SkippedArgs) {
    this.activities.push({ ...args, status: "skipped" })
  }

  onSuccess(args: tr.SuccessArgs) {
    this.activities.push({ ...args, status: "success" })
  }

  onWarning(args: tr.WarnArgs) {
    this.activities.push({ ...args, status: "warning" })
  }
}
