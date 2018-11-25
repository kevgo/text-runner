import { ActivityList } from '../activity-list/activity-list'
import { Configuration } from '../configuration/configuration'

import LinkTargetList from '../link-targets/link-target-list'
import runActivity from './run-activity'
import StatsCounter from './stats-counter'

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
