import { Activity } from "../activity-list/types/activity"
import { StatsCounter } from "../runners/helpers/stats-counter"

export type FormatterName = "detailed" | "dot" | "progress" | "silent" | "summary"

export interface Formatter {
  errorCount(): number
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

export interface FailedArgs {
  activity: Activity
  finalName: string
  error: Error
  /** captured output (via action.log) while executing the activity */
  output: string
}

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}

export interface SkippedArgs {
  activity: Activity
  finalName: string
  output: string
}

export interface FinishArgs {
  stats: StatsCounter
}
