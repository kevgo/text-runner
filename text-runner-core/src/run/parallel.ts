import * as actions from "../actions"
import * as activities from "../activities/index"
import * as commands from "../commands/index"
import * as configuration from "../configuration/index"
import * as linkTargets from "../link-targets"
import { runActivity } from "./run-activity"

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
