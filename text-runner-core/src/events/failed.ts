import { Activity } from "../activity-list/types/activity"

export interface FailedArgs {
  activity: Activity
  finalName: string
  error: Error
  /** captured output (via action.log) while executing the activity */
  output: string
}
