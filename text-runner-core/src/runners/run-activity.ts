import humanize from "humanize-string"
import * as util from "util"
import * as actions from "../actions"
import { Action } from "../actions/types/action"
import { ActionArgs } from "../actions/types/action-args"
import { ActionResult } from "../actions/types/action-result"
import { Activity } from "../activities/index"
import * as configuration from "../configuration/index"
import { LinkTargetList } from "../link-targets/link-target-list"
import { NameRefiner } from "./helpers/name-refiner"
import { OutputCollector } from "./helpers/output-collector"
import { UserError } from "../errors/user-error"
import * as events from "../events/index"
import * as commands from "../commands/index"

/** runs the given activity, indicates whether it encountered an error */
export async function runActivity(
  activity: Activity,
  actionFinder: actions.Finder,
  configuration: configuration.Data,
  linkTargets: LinkTargetList,
  emitter: commands.Command
): Promise<boolean> {
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
  try {
    const action = actionFinder.actionFor(activity)
    let actionResult: ActionResult
    if (action.length === 1) {
      actionResult = await runSyncOrPromiseFunc(action, args)
    } else {
      actionResult = await runCallbackFunc(action, args)
    }
    if (actionResult === undefined) {
      const successArgs: events.SuccessArgs = {
        activity,
        finalName: nameRefiner.finalName(),
        output: outputCollector.toString(),
      }
      emitter.emit("success", successArgs)
    } else if (actionResult === args.SKIPPING) {
      const skippedArgs: events.SkippedArgs = {
        activity,
        finalName: nameRefiner.finalName(),
        output: outputCollector.toString(),
      }
      emitter.emit("skipped", skippedArgs)
    } else {
      throw new Error(`unknown return code from action: ${actionResult}`)
    }
  } catch (e) {
    const failedArgs: events.FailedArgs = {
      activity,
      finalName: nameRefiner.finalName(),
      error: new UserError(e.message, e.guidance || "", activity.file, activity.line),
      output: outputCollector.toString(),
    }
    emitter.emit("failed", failedArgs)
    return true
  }
  return false
}

async function runCallbackFunc(func: Action, args: ActionArgs): Promise<ActionResult> {
  const promisified = util.promisify<ActionArgs, ActionResult>(func)
  return promisified(args)
}

async function runSyncOrPromiseFunc(func: Action, args: ActionArgs): Promise<ActionResult> {
  const result = await Promise.resolve(func(args))
  return result
}
