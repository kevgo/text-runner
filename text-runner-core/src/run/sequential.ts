import { ActivityList } from "../activities/index"
import * as configuration from "../configuration/index"
import * as linkTargets from "../link-targets"
import { runActivity } from "./run-activity"
import * as actions from "../actions"
import * as commands from "../commands/index"

export async function sequential(
  activities: ActivityList,
  actionFinder: actions.Finder,
  configuration: configuration.Data,
  linkTargets: linkTargets.List,
  emitter: commands.Command
): Promise<void> {
  for (const activity of activities) {
    const abort = await runActivity(activity, actionFinder, configuration, linkTargets, emitter)
    if (abort) {
      return
    }
  }
}
