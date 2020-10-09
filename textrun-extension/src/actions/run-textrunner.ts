import * as tr from "text-runner-core"
import * as util from "util"

/** runs Text-Runner in the workspace */
export async function runTextrunner(action: tr.actions.Args): Promise<void> {
  action.name("Running Text-Runner in workspace")
  const command = new tr.commands.Run({
    sourceDir: action.configuration.workspace.joinStr(action.region[0].attributes["dir"] || "."),
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
