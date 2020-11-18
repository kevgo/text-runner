import { Activity } from "../activities/index"

/** defines the events that a command can emit. */
export type Name =
  | "start" // test suite is starting
  | "result" // activity result
  | "finish" // test suite is done
  | "output" // things to print

export type Args = Start | Success | Warning | Skipped | Failed | string

export type Handler = (arg: any) => void

/** signals the start of a test suite */
export interface Start {
  readonly stepCount: number
}

export interface Result {
  readonly status: ResultStatus
}

export type ResultStatus = "failed" | "skipped" | "success" | "warning"

/** signals a failed activity */
export interface Failed {
  readonly activity: Activity
  readonly error: Error
  readonly finalName: string
  /** captured output (via action.log) while executing the activity */
  readonly output: string
  readonly status: "failed"
}

/** signals a skipped activity */
export interface Skipped {
  readonly activity: Activity
  readonly finalName: string
  readonly output: string
  readonly status: "skipped"
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
