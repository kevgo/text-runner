import * as textRunner from "text-runner-engine"

/** runs Text-Runner in the workspace */
export async function runTextrunner(action: textRunner.actions.Args): Promise<void> {
  action.name("Running Text-Runner in workspace")
  const command = new textRunner.commands.Run({
    emptyWorkspace: false,
    sourceDir: action.configuration.workspace.joinStr(action.region[0].attributes["dir"] || "."),
    workspace: "."
  })
  const activityCollector = new textRunner.ActivityCollector(command)
  await command.execute()
  for (const result of activityCollector.results()) {
    // TODO: print more details here when debug mode is activated
    // action.log(util.inspect(result, false, Infinity))
    if (result.error) {
      throw result.error
    }
  }
}
