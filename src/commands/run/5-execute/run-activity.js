// @flow

import type { Activity } from '../4-activities/activity.js'
import type { Action } from '../5-execute/action.js'
import type { ActionArgs } from '../5-execute/action-args.js'

const actionFor = require('./action-for.js')
const Configuration = require('../../../configuration/configuration.js')
const Formatter = require('../../../formatters/formatter.js')
const LinkTargetList = require('../3-link-targets/link-target-list.js')
const StatsCounter = require('../stats-counter.js')
const UnprintedUserError = require('../../../errors/unprinted-user-error.js')
const util = require('util')

module.exports = async function runActivity (
  activity: Activity,
  formatter: Formatter,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
) {
  const args: ActionArgs = {
    nodes: activity.nodes,
    file: activity.file,
    line: activity.line,
    configuration,
    formatter,
    linkTargets
  }
  try {
    const formatter = new configuration.FormatterClass(activity, statsCounter)
    const action = actionFor(activity)
    if (action.length === 1) {
      runSyncOrPromiseFunc(action, args)
    } else {
      runCallbackFunc(action, args)
    }
    formatter.success()
  } catch (err) {
    if (isUserError(err)) {
      throw new UnprintedUserError(err.message, activity.file, activity.line)
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
