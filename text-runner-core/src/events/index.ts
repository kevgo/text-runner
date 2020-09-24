import { Activity } from "../activities/index"

/** CommandEvent defines the events that a command can emit. */
export type CommandEvent =
  | "start" // execution is starting
  | "output" // something to print to the user
  | "success" // a step was successful
  | "failed" // a step failed
  | "skipped" // a step was skipped
  | "warning" // a warning to print to the user
  | "finish" // execution is done

export type Args = FailedArgs | SkippedArgs | StartArgs | SuccessArgs | WarnArgs | string

export type Handler = (arg: any) => void

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
