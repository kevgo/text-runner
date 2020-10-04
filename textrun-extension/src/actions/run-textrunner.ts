import * as path from "path"
import * as tr from "text-runner-core"
import * as util from "util"

import { ActivityCollector } from "../../../shared/cucumber-steps/dist/activity-collector.js"

/** runs Text-Runner in the workspace */
export async function runTextrunner(action: tr.actions.Args): Promise<void> {
  action.name("Running Text-Runner in workspace")
  const relPath = path.join(action.configuration.workspace, action.region[0].attributes["dir"] || ".")
  const command = new tr.commands.Run({
    sourceDir: relPath,
    workspace: ".",
    emptyWorkspace: false,
  })
  const activityCollector = new ActivityCollector(command)
  await command.execute()
  for (const result of activityCollector.results()) {
    action.log(util.inspect(result))
    if (result.error) {
      throw result.error
    }
  }
}
