import humanize from "humanize-string"
import util from "util"
import { Action } from "../actions/action"
import { ActionArgs } from "../actions/action-args"
import { actionFinder } from "../actions/action-finder"
import { ActionResult } from "../actions/action-result"
import { Activity } from "../activity-list/activity"
import { Configuration } from "../configuration/configuration"
import { PrintedUserError } from "../errors/printed-user-error"
import { LinkTargetList } from "../link-targets/link-target-list"
import { NameRefiner } from "./name-refiner"
import { OutputCollector } from "./output-collector"
import { StatsCounter } from "./stats-counter"

export async function runActivity(
  activity: Activity,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter
): Promise<Error | null> {
  const formatter = new configuration.FormatterClass(activity, configuration)
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
    nodes: activity.nodes
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
      formatter.success(nameRefiner.finalName(), outputCollector.toString())
    } else if (result === args.SKIPPING) {
      statsCounter.skip()
      formatter.skipped(nameRefiner.finalName(), outputCollector.toString())
    } else {
      throw new Error(`unknown return code from action: ${result}`)
    }
  } catch (err) {
    statsCounter.error()
    if (isUserError(err)) {
      formatter.failed(nameRefiner.finalName(), err, outputCollector.toString())
      return new PrintedUserError(err)
    } else {
      // here we have a developer error like for example TypeError
      return err
    }
  }
  return null
}

async function runCallbackFunc(
  func: Action,
  args: ActionArgs
): Promise<ActionResult> {
  const promisified = util.promisify<ActionArgs, ActionResult>(func)
  return promisified(args)
}

async function runSyncOrPromiseFunc(
  func: Action,
  args: ActionArgs
): Promise<ActionResult> {
  const result = await Promise.resolve(func(args))
  return result
}

function isUserError(err: Error): boolean {
  return err.name === "Error"
}
