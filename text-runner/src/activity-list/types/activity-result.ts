import { Activity, scaffoldActivity } from "./activity"

/** ActivityResult represents the result of an activity. */
export interface ActivityResult {
  /** the activity run */
  activity: Activity

  /** the error encountered */
  error: Error | null

  /** the final name of the activity */
  finalName: string

  /** the output created by the activity via action.log */
  output: string

  status: ActivityResultStatus
}

export type ActivityResultStatus =
  | "failed" // red test
  | "skipped" // skipped
  | "success" // green test

/** for testing */
export function scaffoldActivityResult(): ActivityResult {
  return {
    activity: scaffoldActivity(),
    error: null,
    finalName: "",
    output: "",
    status: "success",
  }
}
