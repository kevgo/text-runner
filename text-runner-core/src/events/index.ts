import { Activity } from "../activities/index"

/** CommandEvent defines the events that a command can emit. */
export enum CommandEvent {
  start = "start", // execution is starting
  output = "output", // something to print to the user
  success = "success", // a step was successful
  failed = "failed", // a step failed
  skipped = "skipped", // a step was skipped
  warning = "warning", // a warning to print to the user
  finish = "finish", // execution is done
}

export interface FailedArgs {
  activity: Activity
  finalName: string
  error: Error
  /** captured output (via action.log) while executing the activity */
  output: string
}

export interface SkippedArgs {
  activity: Activity
  finalName: string
  output: string
}

export interface StartArgs {
  stepCount: number
}

export interface SuccessArgs {
  activity: Activity
  finalName: string
  /** captured output (via action.log) while executing the activity */
  output: string
}

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}
