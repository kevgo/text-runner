import { EventEmitter } from "events"
import * as tr from "text-runner"

/** Statistics about a run of Text-Runner */
export interface TestActivity {
  activity?: tr.Activity
  finalName?: string
  status: "success" | "failed" | "skipped" | "warning"
  output?: string
  error?: Error
  message?: string // warning message
}

/** StatsCollector provides statistics about the Text-Runner command it observes. */
export class ActivityCollector {
  _activities: TestActivity[]

  constructor(emitter: EventEmitter) {
    this._activities = []
    emitter.on(tr.CommandEvent.failed, this.onFailure.bind(this))
    emitter.on(tr.CommandEvent.skipped, this.onSkipped.bind(this))
    emitter.on(tr.CommandEvent.success, this.onSuccess.bind(this))
    emitter.on(tr.CommandEvent.warning, this.onWarning.bind(this))
  }

  activities(): TestActivity[] {
    return this._activities
  }

  onFailure(args: tr.FailedArgs) {
    this._activities.push({ ...args, status: "failed" })
  }

  onSkipped(args: tr.SkippedArgs) {
    this._activities.push({ ...args, status: "skipped" })
  }

  onSuccess(args: tr.SuccessArgs) {
    this._activities.push({ ...args, status: "success" })
  }

  onWarning(args: tr.WarnArgs) {
    this._activities.push({ ...args, status: "warning" })
  }
}
