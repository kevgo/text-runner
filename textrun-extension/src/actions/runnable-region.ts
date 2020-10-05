import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"
import * as util from "util"

import { ActivityCollector } from "../../../shared/cucumber-steps/dist/activity-collector.js"

/** runs the given content in Text-Runner */
export async function runnableRegion(action: tr.actions.Args): Promise<void> {
  action.name("execute Markdown in Text-Runner")
  const content = action.region.text().trim()
  if (content === "") {
    throw new Error("no content to run found")
  }
  await fs.writeFile(path.join(action.configuration.workspace, "runnable-region.md"), content)
  const command = new tr.commands.Run({
    sourceDir: action.configuration.workspace,
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
