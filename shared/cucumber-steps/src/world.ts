import { ObservableProcess } from "observable-process"
import { UserError } from "text-runner"
import { ActivityResult } from "./blackhole-formatter"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** exception thrown at the last API call returned */
  apiException: UserError | undefined

  /** result of the last API call */
  activityResults: ActivityResult[]

  /** the currently running subshell process */
  process: ObservableProcess | undefined

  /** the test directory */
  rootDir: string

  /** whether debug mode is enabled */
  debug: boolean
}
