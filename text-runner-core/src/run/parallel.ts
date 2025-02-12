import * as actions from "../actions/index.js"
import * as activities from "../activities/index.js"
import * as commands from "../commands/index.js"
import * as configuration from "../configuration/index.js"
import * as linkTargets from "../link-targets/index.js"
import { runActivity } from "./run-activity.js"

/**
 * Executes the given activities in parallel.
 * Returns the errors they produce.
 */
export function parallel(
  activities: activities.List,
  actionFinder: actions.Finder,
  targets: linkTargets.List,
  configuration: configuration.Data,
  emitter: commands.Command
): Promise<boolean>[] {
  const result: Promise<boolean>[] = []
  for (const activity of activities) {
    result.push(runActivity(activity, actionFinder, configuration, targets, emitter))
  }
  return result
}
