import { ActivityList } from "../activity-list/activity-list.js"
import { Configuration } from "../configuration/configuration.js"

import LinkTargetList from "../link-targets/link-target-list.js"
import runActivity from "./run-activity.js"
import StatsCounter from "./stats-counter.js"

export default (async function executeSequential(
  activities: ActivityList,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<Error | null> {
  for (const activity of activities) {
    const error = await runActivity(
      activity,
      configuration,
      linkTargets,
      statsCounter
    )
    if (error) {
      return error
    }
  }
  return null
})
