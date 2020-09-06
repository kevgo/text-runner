import { CommandEvent } from "text-runner"
import { Activity } from "text-runner/dist/activity-list/types/activity"
import { EventEmitter } from "events"

/** the result of running an activity */
export interface ActivityResult {
  activity: Activity // the activity run
  finalName?: string // the refined name of the activity
  output?: string // output via action.log
  error?: Error // the exception thrown
  message?: string // the warning message emitted
  status: "success" | "failed" | "skipped"
}

/** A formatter that prints absolutely nothing */
export class BlackholeFormatter {
  activityResults: ActivityResult[]

  constructor(emitter: EventEmitter) {
    this.activityResults = []
    const pushArgs = this.activityResults.push.bind(this.activityResults)
    emitter.on(CommandEvent.success, pushArgs)
    emitter.on(CommandEvent.failed, pushArgs)
    emitter.on(CommandEvent.warning, pushArgs)
    emitter.on(CommandEvent.skipped, pushArgs)
  }
}
