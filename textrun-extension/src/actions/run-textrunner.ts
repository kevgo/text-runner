import * as tr from "text-runner-core"

import { ActivityCollector } from "../../../shared/cucumber-steps/src/activity-collector"

/** runs Text-Runner in the workspace */
export async function runTextrunner(action: tr.actions.Args): Promise<void> {
  action.name("Running Text-Runner in workspace")
  const command = new tr.commands.Run({
    sourceDir: action.configuration.workspace,
    workspace: action.configuration.workspace,
    emptyWorkspace: false,
  })
  const activityCollector = new ActivityCollector(command)
  await command.execute()
  action.log(activityCollector.results())
}
