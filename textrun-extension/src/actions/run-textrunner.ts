import * as tr from "text-runner-core"
import * as util from "util"

import { ActivityCollector } from "../../../shared/cucumber-steps/dist/activity-collector.js"

/** runs Text-Runner in the workspace */
export async function runTextrunner(action: tr.actions.Args): Promise<void> {
  action.name("Running Text-Runner in workspace")
  const command = new tr.commands.Run({
    sourceDir: action.configuration.workspace,
    workspace: ".",
    emptyWorkspace: false,
  })
  const activityCollector = new ActivityCollector(command)
  await command.execute()
  const results = activityCollector.results()
  for (const result of results) {
    action.log(util.inspect(result))
    if (result.error) {
      throw result.error
    }
  }
}
