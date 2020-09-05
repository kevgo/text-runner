import { Formatter, SuccessArgs, FailedArgs, SkippedArgs, WarnArgs, CommandEvent } from "text-runner"
import { Activity } from "text-runner/dist/activity-list/types/activity"
import { EventEmitter } from "events"

/** the result of running an activity */
interface ActivityResult {
  activity?: Activity // the activity run
  finalName?: string // the refined name of the activity
  output?: string // output via action.log
  error?: Error // the exception thrown
  message?: string // the warning message emitted
}

/** A formatter that prints absolutely nothing */
export class BlackholeFormatter implements Formatter {
  activityResults: ActivityResult[]

  constructor(emitter: EventEmitter) {
    this.activityResults = []
    emitter.on(CommandEvent.success, this.success.bind(this))
    emitter.on(CommandEvent.failed, this.failed.bind(this))
    emitter.on(CommandEvent.warning, this.warning.bind(this))
    emitter.on(CommandEvent.skipped, this.skipped.bind(this))
  }

  success(args: SuccessArgs) {
    this.activityResults.push(args)
  }

  failed(args: FailedArgs) {
    this.activityResults.push(args)
  }

  skipped(args: SkippedArgs) {
    this.activityResults.push(args)
  }

  warning(args: WarnArgs) {
    this.activityResults.push(args)
  }

  errorCount(): number {
    return this.errorCount()
  }
}
