// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
const Configuration = require('../../../configuration/configuration.js')
const Formatter = require('../../../formatters/formatter.js')
const LinkTargetList = require('../3-link-targets/link-target-list.js')
const runActivity = require('./run-activity.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = async function executeSequential (
  activities: ActivityList,
  formatter: Formatter,
  configuration: Configuration,
  linkTargets: LinkTargetList
): Promise<?UnprintedUserError> {
  for (const activity of activities) {
    const error = await runActivity(
      activity,
      formatter,
      configuration,
      linkTargets
    )
    if (error) return error
  }
  return null
}
