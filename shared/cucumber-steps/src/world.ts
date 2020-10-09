import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-core"

/** World is the shared data structure that is provided as `this` to Cucumber steps. */
export interface TRWorld {
  /** exception thrown at the last API call returned */
  apiException: textRunner.UserError | undefined

  /** result of the last API call */
  apiResults: textRunner.ActivityResults

  /** whether debug mode is enabled */
  debug: boolean

  /** statistics about the subshell process after it finished */
  finishedProcess: observableProcess.FinishedProcess | undefined

  /** the test directory */
  rootDir: textRunner.files.AbsoluteDir
}
