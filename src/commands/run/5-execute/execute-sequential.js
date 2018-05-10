// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
import type { Configuration } from '../../../configuration/configuration.js'

const LinkTargetList = require('../3-link-targets/link-target-list.js')
const runActivity = require('./run-activity.js')
const StatsCounter = require('../stats-counter.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = async function executeSequential (
  activities: ActivityList,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<?UnprintedUserError> {
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
