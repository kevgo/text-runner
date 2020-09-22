import { Activity } from "../activities/index"

export interface WarnArgs {
  activity?: Activity
  finalName?: string
  message: string
}
