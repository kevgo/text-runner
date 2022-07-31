import * as cucumber from "@cucumber/cucumber"
import * as observableProcess from "observable-process"
import * as textRunner from "text-runner-core"


export class TRWorld extends cucumber.World {
  /** exception thrown at the last API call returned */
  apiException: textRunner.UserError | undefined

  /** result of the last API call */
  apiResults = new textRunner.ActivityResults([], "")

  /** whether debug mode is enabled */
  debug = false

  /** statistics about the subshell process after it finished */
  finishedProcess: observableProcess.FinishedProcess | undefined

  /** the workspace */
  workspace = new textRunner.files.AbsoluteDirPath("uninitialized")
}

cucumber.setWorldConstructor(TRWorld)
