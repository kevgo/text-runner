import { Activity } from "../activities/types/activity"

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}
