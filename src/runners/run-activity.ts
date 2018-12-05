import { Activity } from '../activity-list/activity'
import { Configuration } from '../configuration/configuration'
import { Action } from './action'
import { ActionArgs } from './action-args'

import util from 'util'
import PrintedUserError from '../errors/printed-user-error'
import LinkTargetList from '../link-targets/link-target-list'
import actionRepo from './action-repo'
import StatsCounter from './stats-counter'

export default (async function runActivity(
  activity: Activity,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<Error | null> {
  const formatter = new configuration.FormatterClass(
    activity,
    configuration.sourceDir,
    statsCounter
  )
  const args: ActionArgs = {
    configuration,
    file: activity.file.platformified(),
    formatter,
    line: activity.line,
    linkTargets,
    nodes: activity.nodes
  }
  try {
    const action = actionRepo.actionFor(activity)
    if (action.length === 1) {
      await runSyncOrPromiseFunc(action, args)
    } else {
      await runCallbackFunc(action, args)
    }
    if (!formatter.skipped && !formatter.warned) {
      formatter.success()
    }
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
})

async function runCallbackFunc(func: Action, args: ActionArgs) {
  const promisified = util.promisify(func)
  await promisified(args)
}

async function runSyncOrPromiseFunc(func: Action, args: ActionArgs) {
  await Promise.resolve(func(args))
}

function isUserError(err: Error): boolean {
  return err.name === 'Error'
}
