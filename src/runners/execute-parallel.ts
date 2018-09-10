import { ActivityList } from "../activity-list/activity-list.js"
import { Configuration } from "../configuration/configuration.js"

import LinkTargetList from "../link-targets/link-target-list.js"
import runActivity from "./run-activity.js"
import StatsCounter from "./stats-counter.js"

// Executes the given activities in parallel.
// Returns the errors they produce.
export default function executeParallel(
  activities: ActivityList,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  statsCounter: StatsCounter
): Array<Promise<Error | null>> {
  return activities.map(activity => {
    return runActivity(activity, configuration, linkTargets, statsCounter)
  })
}
