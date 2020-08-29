import humanize from "humanize-string"
import * as util from "util"
import { ActionFinder } from "../actions/action-finder"
import { Action } from "../actions/types/action"
import { ActionArgs } from "../actions/types/action-args"
import { ActionResult } from "../actions/types/action-result"
import { Activity } from "../activity-list/types/activity"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/types/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { NameRefiner } from "./helpers/name-refiner"
import { OutputCollector } from "./helpers/output-collector"
import { StatsCounter } from "./helpers/stats-counter"

export async function runActivity(
  activity: Activity,
  actionFinder: ActionFinder,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<number> {
  const outputCollector = new OutputCollector()
  const nameRefiner = new NameRefiner(humanize(activity.actionName))
  const args: ActionArgs = {
    SKIPPING: 1,
    configuration,
    file: activity.file.platformified(),
    line: activity.line,
    linkTargets,
    log: outputCollector.logFn(),
    name: nameRefiner.refineFn(),
    region: activity.region,
    document: activity.document,
  }
  try {
    const action = actionFinder.actionFor(activity)
    let result: ActionResult
    if (action.length === 1) {
      result = await runSyncOrPromiseFunc(action, args)
    } else {
      result = await runCallbackFunc(action, args)
    }
    if (result === undefined) {
      statsCounter.success()
      formatter.success(activity, nameRefiner.finalName(), outputCollector.toString())
    } else if (result === args.SKIPPING) {
      statsCounter.skip()
      formatter.skipped(activity, nameRefiner.finalName(), outputCollector.toString())
    } else {
      throw new Error(`unknown return code from action: ${result}`)
    }
  } catch (err) {
    statsCounter.error()
    if (isUserError(err)) {
      formatter.failed(activity, nameRefiner.finalName(), err, outputCollector.toString())
      return 1
    }
    // here we have a developer error like for example TypeError
    throw err
  }
  return 0
}

async function runCallbackFunc(func: Action, args: ActionArgs): Promise<ActionResult> {
  const promisified = util.promisify<ActionArgs, ActionResult>(func)
  return promisified(args)
}

async function runSyncOrPromiseFunc(func: Action, args: ActionArgs): Promise<ActionResult> {
  const result = await Promise.resolve(func(args))
  return result
}

function isUserError(err: Error): boolean {
  return err.name === "Error"
}
