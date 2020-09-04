import humanize from "humanize-string"
import * as util from "util"
import { ActionFinder } from "../actions/action-finder"
import { Action } from "../actions/types/action"
import { ActionArgs } from "../actions/types/action-args"
import { ActionResult } from "../actions/types/action-result"
import { Activity } from "../activity-list/types/activity"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "../formatters/formatter"
import { LinkTargetList } from "../link-targets/link-target-list"
import { NameRefiner } from "./helpers/name-refiner"
import { OutputCollector } from "./helpers/output-collector"
import { StatsCounter } from "./helpers/stats-counter"
import { ExecuteResult } from "./execute-result"
import { ActivityResult, ActivityResultStatus } from "../activity-list/types/activity-result"
import stripAnsi = require("strip-ansi")
import { UserError } from "../errors/user-error"

export async function runActivity(
  activity: Activity,
  actionFinder: ActionFinder,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter,
  formatter: Formatter
): Promise<ExecuteResult> {
  const outputCollector = new OutputCollector()
  const nameRefiner = new NameRefiner(humanize(activity.actionName))
  const args: ActionArgs = {
    SKIPPING: 254,
    configuration,
    file: activity.file.platformified(),
    line: activity.line,
    linkTargets,
    log: outputCollector.logFn(),
    name: nameRefiner.refineFn(),
    region: activity.region,
    document: activity.document,
  }
  let activityResultStatus: ActivityResultStatus
  try {
    const action = actionFinder.actionFor(activity)
    let actionResult: ActionResult
    if (action.length === 1) {
      actionResult = await runSyncOrPromiseFunc(action, args)
    } else {
      actionResult = await runCallbackFunc(action, args)
    }
    if (actionResult === undefined) {
      statsCounter.success()
      activityResultStatus = "success"
      formatter.success(activity, nameRefiner.finalName(), outputCollector.toString())
    } else if (actionResult === args.SKIPPING) {
      statsCounter.skip()
      activityResultStatus = "skipped"
      formatter.skipped(activity, nameRefiner.finalName(), outputCollector.toString())
    } else {
      throw new Error(`unknown return code from action: ${actionResult}`)
    }
  } catch (e) {
    statsCounter.error()
    if (!isUserError(e)) {
      // here we have a developer error like for example ReferenceError
      throw e
    }
    formatter.failed(activity, nameRefiner.finalName(), e, outputCollector.toString())
    const error = e.name === "UserError" ? e : new UserError(e.message)
    const activityResult: ActivityResult = {
      activity,
      error,
      output: outputCollector.toString(),
      finalName: stripAnsi(nameRefiner.finalName()),
      status: "failed",
    }
    return new ExecuteResult([activityResult], 1)
  }
  const activityResult: ActivityResult = {
    activity,
    error: null,
    output: outputCollector.toString(),
    finalName: stripAnsi(nameRefiner.finalName()),
    status: activityResultStatus,
  }
  return new ExecuteResult([activityResult], 0)
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
  return err.name === "UserError" || err.name === "Error"
}
