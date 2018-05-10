// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
import type { Configuration } from '../../../configuration/configuration.js'

const LinkTargetList = require('../3-link-targets/link-target-list.js')
const runActivity = require('./run-activity.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')
const StatsCounter = require('../stats-counter.js')

// Executes the given activities in parallel.
// Returns the errors they produce.
module.exports = async function executeParallel (
  activities: ActivityList,
  linkTargets: LinkTargetList,
  configuration: Configuration,
  statsCounter: StatsCounter
): Promise<Array<Promise<?UnprintedUserError>>> {
  const result = []
  for (const activity of activities) {
    result.push(runActivity(activity, configuration, linkTargets, statsCounter))
  }
  return result
}
