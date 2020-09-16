import { Activity } from "../activity-list/types/activity"

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}
