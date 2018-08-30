// @flow

import type { Activity } from '../activity-list/activity.js'
import type { Action } from './action.js'
import type { ActionArgs } from './action-args.js'
import type { Configuration } from '../configuration/configuration.js'

const actionFor = require('./action-for.js')
const LinkTargetList = require('../link-targets/link-target-list.js')
const StatsCounter = require('./stats-counter.js')
const PrintedUserError = require('../errors/printed-user-error.js')
const util = require('util')

module.exports = async function runActivity (
  activity: Activity,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<?Error> {
  const formatter = new configuration.FormatterClass(
    activity,
    configuration.sourceDir,
    statsCounter
  )
  const args: ActionArgs = {
    nodes: activity.nodes,
    file: activity.file.platformified(),
    line: activity.line,
    configuration,
    formatter,
    linkTargets
  }
  try {
    const action = actionFor(activity)
    if (action.length === 1) {
      await runSyncOrPromiseFunc(action, args)
    } else {
      await runCallbackFunc(action, args)
    }
    if (!formatter.skipped && !formatter.warned) formatter.success()
  } catch (err) {
    if (isUserError(err)) {
      formatter.error(err.message)
      return new PrintedUserError(err)
    } else {
      // here we have a developer error like for example TypeError
      return err
    }
  }
  return null
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
