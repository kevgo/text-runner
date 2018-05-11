// @flow

import type { Activity } from '../4-activities/activity.js'
import type { Action } from '../5-execute/action.js'
import type { ActionArgs } from '../5-execute/action-args.js'
import type { Configuration } from '../../../configuration/configuration.js'

const actionFor = require('./action-for.js')
const LinkTargetList = require('../3-link-targets/link-target-list.js')
const StatsCounter = require('../stats-counter.js')
const PrintedUserError = require('../../../errors/printed-user-error.js')
const util = require('util')

module.exports = async function runActivity (
  activity: Activity,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
) {
  const formatter = new configuration.FormatterClass(activity, statsCounter)
  const args: ActionArgs = {
    nodes: activity.nodes,
    file: activity.file,
    line: activity.line,
    configuration,
    formatter,
    linkTargets
  }
  try {
    const action = actionFor(activity)
    if (action.length === 1) {
      runSyncOrPromiseFunc(action, args)
    } else {
      runCallbackFunc(action, args)
    }
    if (!formatter.skipped && !formatter.warned) formatter.success()
  } catch (err) {
    if (isUserError(err)) {
      formatter.error(err.message)
      throw new PrintedUserError(err)
    } else {
      // here we have a developer error
      throw err
    }
  }
}

async function runCallbackFunc (func: Action, args: ActionArgs) {
  const promisified = util.promisify(func)
  await promisified(args)
}

async function runSyncOrPromiseFunc (func: Action, args: ActionArgs) {
  await Promise.resolve(func(args))
}

function isUserError (err: Error): boolean {
  return err.name === 'Error'
}
