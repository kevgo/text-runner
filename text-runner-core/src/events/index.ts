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
  stepCount: number
}

export interface Result {
  status: ResultStatus
}

export type ResultStatus = "failed" | "skipped" | "success" | "warning"

/** signals a failed activity */
export interface Failed {
  activity: Activity
  error: Error
  finalName: string
  /** captured output (via action.log) while executing the activity */
  output: string
  status: "failed"
}

/** signals a skipped activity */
export interface Skipped {
  activity: Activity
  finalName: string
  output: string
  status: "skipped"
}

/** signals a successful activity */
export interface Success {
  activity: Activity
  finalName: string
  /** captured output (via action.log) while executing the activity */
  output: string
  status: "success"
}

/** signals an activity succeeded but with warnings */
export interface Warning {
  activity?: Activity
  finalName?: string
  message: string
  status: "warning"
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
