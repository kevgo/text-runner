import { promises as fs } from "fs"
import * as textRunner from "text-runner-engine"
import * as util from "util"

/** runs the given content in Text-Runner */
export async function runnableRegion(action: textRunner.actions.Args): Promise<void> {
  action.name("execute Markdown in Text-Runner")
  const content = action.region.text().trim()
  if (content === "") {
    throw new Error("no content to run found")
  }
  await fs.writeFile(action.configuration.workspace.joinStr("runnable-region.md"), content)
  const command = new textRunner.commands.Run({
    emptyWorkspace: false,
    sourceDir: action.configuration.workspace.platformified(),
    workspace: "."
  })
  const activityCollector = new textRunner.ActivityCollector(command)
  await command.execute()
  for (const result of activityCollector.results()) {
    action.log(util.inspect(result, false, Infinity))
    if (result.error) {
      throw result.error
    }
  }
}
