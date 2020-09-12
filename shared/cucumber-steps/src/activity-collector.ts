import { EventEmitter } from "events"
import { Activity, CommandEvent, SuccessArgs, FailedArgs, SkippedArgs, WarnArgs } from "text-runner"

/** Statistics about a run of Text-Runner */
export interface TestActivity {
  activity?: Activity
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
    emitter.on(CommandEvent.failed, this.onFailure.bind(this))
    emitter.on(CommandEvent.skipped, this.onSkipped.bind(this))
    emitter.on(CommandEvent.success, this.onSuccess.bind(this))
    emitter.on(CommandEvent.warning, this.onWarning.bind(this))
  }

  activities(): TestActivity[] {
    return this._activities
  }

  onFailure(args: FailedArgs) {
    this._activities.push({ ...args, status: "failed" })
  }

  onSkipped(args: SkippedArgs) {
    this._activities.push({ ...args, status: "skipped" })
  }

  onSuccess(args: SuccessArgs) {
    this._activities.push({ ...args, status: "success" })
  }

  onWarning(args: WarnArgs) {
    this._activities.push({ ...args, status: "warning" })
  }
}
