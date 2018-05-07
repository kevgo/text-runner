// @flow

import type { ActivityList } from '../4-activities/activity-list.js'
const ActivityTypeManager = require('./activity-type-manager.js')
const LinkTargetList = require('../3-link-targets/link-target-list.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')

// Executes the given activities in parallel.
// Returns the errors they produce.
module.exports = async function executeParallel (
  activities: ActivityList,
  activityTypeManager: ActivityTypeManager,
  linkTargets: LinkTargetList
): Promise<Array<Promise<?UnprintedUserError>>> {
  const result = []
  for (const activity of activities) {
    const func = activityTypeManager.handlerFunctionFor(activity)
    result.push(func(activity))
  }
  return result
}
