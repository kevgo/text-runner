import { ActivityList } from "../activity-list/types/activity-list"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/types/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { StatsCounter } from "./helpers/stats-counter"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { ActivityResult } from "../activity-list/types/activity-result"

export async function executeSequential(
  activities: ActivityList,
  actionFinder: ActionFinder,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<ActivityResult[]> {
  const result: ActivityResult[] = []
  for (const activity of activities) {
    const actRes = await runActivity(activity, actionFinder, configuration, linkTargets, statsCounter, formatter)
    result.push(actRes)
    if (actRes.error) {
      return result
    }
  }
  return result
}
