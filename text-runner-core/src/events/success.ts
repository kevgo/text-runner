import { Activity } from "../activities/index"

export interface SuccessArgs {
  activity: Activity
  finalName: string
  /** captured output (via action.log) while executing the activity */
  output: string
}
