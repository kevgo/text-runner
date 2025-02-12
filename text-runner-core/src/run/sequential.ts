import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import * as commands from "../commands/index.js"
import * as configuration from "../configuration/index.js"
import * as linkTargets from "../link-targets/index.js"
import { runActivity } from "./run-activity.js"

export async function sequential(
  activities: activities.List,
  actionFinder: actions.Finder,
  configuration: configuration.Data,
  linkTargets: linkTargets.List,
  emitter: commands.Command,
): Promise<void> {
  for (const activity of activities) {
    const abort = await runActivity(activity, actionFinder, configuration, linkTargets, emitter)
    if (abort) {
      return
    }
  }
}
