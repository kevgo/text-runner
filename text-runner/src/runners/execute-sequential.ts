import { ActivityList } from "../activity-list/types/activity-list"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/types/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { StatsCounter } from "./helpers/stats-counter"
import { runActivity } from "./run-activity"

export async function executeSequential(
  activities: ActivityList,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<Error | null> {
  for (const activity of activities) {
    const error = await runActivity(activity, configuration, linkTargets, statsCounter, formatter)
    if (error) {
      return error
    }
  }
  return null
}
