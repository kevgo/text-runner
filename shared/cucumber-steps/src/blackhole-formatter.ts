import { CommandEvent, SuccessArgs, FailedArgs, WarnArgs, SkippedArgs } from "text-runner"
import { Activity } from "text-runner/dist/activity-list/types/activity"
import { EventEmitter } from "events"

/** the result of running an activity */
export interface ActivityResult {
  activity?: Activity // the activity run
  finalName?: string // the refined name of the activity
  output?: string // output via action.log
  error?: Error // the exception thrown
  message?: string // the warning message emitted
  status: "success" | "failed" | "skipped" | "warning"
}

/** A formatter that prints absolutely nothing */
export class BlackholeFormatter {
  activityResults: ActivityResult[]

  constructor(emitter: EventEmitter) {
    this.activityResults = []
    const pushArgs = this.activityResults.push.bind(this.activityResults)
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skip.bind(this))
  }
  success(args: SuccessArgs) {
    this.activityResults.push({ ...args, status: "success" })
  }
  failed(args: FailedArgs) {
    this.activityResults.push({ ...args, status: "failed" })
  }
  warning(args: WarnArgs) {
    this.activityResults.push({ ...args, status: "warning" })
  }
  skip(args: SkippedArgs) {
    this.activityResults.push({ ...args, status: "skipped" })
  }
}
