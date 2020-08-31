import { Activity, scaffoldActivity } from "./activity"

/** ActivityResult represents the result of an activity. */
export interface ActivityResult {
  /** the activity run */
  activity: Activity

  /** the output created by the activity via action.log */
  output: string

  /** the error encountered */
  error: Error | null
}

/** for testing */
export function scaffoldActivityResult(): ActivityResult {
  return {
    activity: scaffoldActivity(),
    error: null,
    output: "",
  }
}
