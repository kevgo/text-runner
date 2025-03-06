import { Activity } from "../activities/index.js"

export type Args = Failed | Skipped | Start | string | Success | Warning

/** signals a failed activity */
export interface Failed {
  readonly activity: Activity
  readonly error: Error
  readonly finalName: string
  /** captured output (via action.log) while executing the activity */
  readonly output: string
  readonly status: "failed"
}

export type Handler = (arg: any) => void

/** defines the events that a command can emit. */
export type Name =
  | "finish" // test suite is done
  | "output" // things to print
  | "result" // activity result
  | "start" // test suite is starting

export interface Result {
  readonly status: ResultStatus
}

export type ResultStatus = "failed" | "skipped" | "success" | "warning"

/** signals a skipped activity */
export interface Skipped {
  readonly activity: Activity
  readonly finalName: string
  readonly output: string
  readonly status: "skipped"
}

/** signals the start of a test suite */
export interface Start {
  readonly stepCount: number
}

/** signals a successful activity */
export interface Success {
  readonly activity: Activity
  readonly finalName: string
  /** captured output (via action.log) while executing the activity */
  readonly output: string
  readonly status: "success"
}

/** signals an activity succeeded but with warnings */
export interface Warning {
  readonly activity?: Activity
  readonly finalName?: string
  readonly message: string
  readonly status: "warning"
}

export function instanceOfFailed(event: Result): event is Failed {
  return event.status === "failed"
}

export function instanceOfSkipped(event: Result): event is Skipped {
  return event.status === "skipped"
}

export function instanceOfSuccess(event: Result): event is Success {
  return event.status === "success"
}

export function instanceOfWarning(event: Result): event is Warning {
  return event.status === "warning"
}
