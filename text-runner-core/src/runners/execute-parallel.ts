import { ActivityList } from "../activities/types/activity-list"
import { Configuration } from "../configuration/configuration"
import { LinkTargetList } from "../link-targets/link-target-list"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"

/**
 * Executes the given activities in parallel.
 * Returns the errors they produce.
 */
export function executeParallel(
  activities: ActivityList,
  actionFinder: ActionFinder,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  emitter: EventEmitter
): Promise<boolean>[] {
  const result: Promise<boolean>[] = []
  for (const activity of activities) {
    result.push(runActivity(activity, actionFinder, configuration, linkTargets, emitter))
  }
  return result
}
