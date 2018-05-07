// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
const ActivityTypeManager = require('./activity-type-manager.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

module.exports = async function executeSequential (
  activities: ActivityList,
  activityTypeManager: ActivityTypeManager
): Promise<?UnprintedUserError> {
  for (const activity of activities) {
    const func = activityTypeManager.handlerFunctionFor(activity)
    await func(activity)
  }
  return null
}
