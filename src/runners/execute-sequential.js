// @flow

import type { ActivityList } from '../activity-list/activity-list.js'
import type { Configuration } from '../configuration/configuration.js'

const LinkTargetList = require('../link-targets/link-target-list.js')
const runActivity = require('./run-activity.js')
const StatsCounter = require('./stats-counter.js')

module.exports = async function executeSequential (
  activities: ActivityList,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<?Error> {
  for (const activity of activities) {
    const error = await runActivity(
      activity,
      configuration,
      linkTargets,
      statsCounter
    )
    if (error) return error
  }
  return null
}
