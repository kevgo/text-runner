import { ActivityList } from "../activity-list/types/activity-list"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/types/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { StatsCounter } from "./helpers/stats-counter"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { ActivityResult } from "../activity-list/types/activity-result"

/**
 * Executes the given activities in parallel.
 * Returns the errors they produce.
 */
export function executeParallel(
  activities: ActivityList,
  actionFinder: ActionFinder,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<ActivityResult>[] {
  return activities.map((activity) => {
    // TODO: remove return and enclosing curly braces
    return runActivity(activity, actionFinder, configuration, linkTargets, statsCounter, formatter)
  })
}
