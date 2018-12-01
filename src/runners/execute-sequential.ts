import { ActivityList } from '../activity-list/activity-list'
import { Configuration } from '../configuration/configuration'

import LinkTargetList from '../link-targets/link-target-list'
import runActivity from './run-activity'
import StatsCounter from './stats-counter'

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
