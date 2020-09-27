import { ObservableProcess } from "observable-process"
import * as textRunner from "text-runner-core"
import { ActivityResult } from "./activity-collector"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** exception thrown at the last API call returned */
  apiException: textRunner.UserError | undefined

  /** result of the last API call */
  apiResults: ActivityResult[]

  /** whether debug mode is enabled */
  debug: boolean

  /** the currently running subshell process */
  process: ObservableProcess | undefined

  /** the test directory */
  rootDir: string
}
