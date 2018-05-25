// @flow

import type { ActivityList } from '../activity-list/activity-list.js'
import type { Configuration } from '../configuration/configuration.js'

const LinkTargetList = require('../link-targets/link-target-list.js')
const runActivity = require('./run-activity.js')
const StatsCounter = require('./stats-counter.js')

// Executes the given activities in parallel.
// Returns the errors they produce.
module.exports = function executeParallel (
  activities: ActivityList,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  statsCounter: StatsCounter
): Array<Promise<?Error>> {
  return activities.map(activity => {
    return runActivity(activity, configuration, linkTargets, statsCounter)
  })
}
