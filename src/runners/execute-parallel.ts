import { ActivityList } from "../activity-list/types/activity-list"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/types/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { StatsCounter } from "./helpers/stats-counter"
import { runActivity } from "./run-activity"

/**
 * Executes the given activities in parallel.
 * Returns the errors they produce.
 */
export function executeParallel(
  activities: ActivityList,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<Error | null>[] {
  return activities.map(activity => {
    return runActivity(
      activity,
      configuration,
      linkTargets,
      statsCounter,
      formatter
    )
  })
}
