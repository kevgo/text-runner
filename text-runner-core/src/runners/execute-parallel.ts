import { ActivityList } from "../activities/index"
import * as configuration from "../configuration/index"
import { LinkTargetList } from "../link-targets/link-target-list"
import { runActivity } from "./run-activity"
import * as actions from "../actions"
import * as commands from "../commands/index"

/**
 * Executes the given activities in parallel.
 * Returns the errors they produce.
 */
export function executeParallel(
  activities: ActivityList,
  actionFinder: actions.ActionFinder,
  linkTargets: LinkTargetList,
  configuration: configuration.Data,
  emitter: commands.Command
): Promise<boolean>[] {
  const result: Promise<boolean>[] = []
  for (const activity of activities) {
    result.push(runActivity(activity, actionFinder, configuration, linkTargets, emitter))
  }
  return result
}
