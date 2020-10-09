import { promises as fs } from "fs"
import * as path from "path"
import * as tr from "text-runner-core"
import * as util from "util"

/** runs the given content in Text-Runner */
export async function runnableRegion(action: tr.actions.Args): Promise<void> {
  action.name("execute Markdown in Text-Runner")
  const content = action.region.text().trim()
  if (content === "") {
    throw new Error("no content to run found")
  }
  await fs.writeFile(path.join(action.configuration.workspace.platformified(), "runnable-region.md"), content)
  const command = new tr.commands.Run({
    sourceDir: action.configuration.workspace.platformified(),
    workspace: ".",
    emptyWorkspace: false,
  })
  const activityCollector = new tr.ActivityCollector(command)
  await command.execute()
  for (const result of activityCollector.results()) {
    action.log(util.inspect(result))
    if (result.error) {
      throw result.error
    }
  }
}
