import { ObservableProcess } from "observable-process"
import { ExecuteResult, UserError } from "text-runner"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** exception thrown at the last API call returned */
  apiException: UserError | undefined

  /** result of the last API call */
  apiResults: ExecuteResult

  /** the currently running subshell process */
  process: ObservableProcess | undefined

  /** the test directory */
  rootDir: string

  /** whether debug mode is enabled */
  debug: boolean
}
