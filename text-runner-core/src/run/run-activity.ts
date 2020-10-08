import humanize from "humanize-string"
import * as util from "util"

import * as actions from "../actions"
import { Activity } from "../activities/index"
import * as commands from "../commands/index"
import * as configuration from "../configuration/index"
import { UserError } from "../errors/user-error"
import * as linkTargets from "../link-targets"
import { NameRefiner } from "./name-refiner"
import { OutputCollector } from "./output-collector"

/** runs the given activity, indicates whether it encountered an error */
export async function runActivity(
  activity: Activity,
  actionFinder: actions.Finder,
  configuration: configuration.Data,
  targets: linkTargets.List,
  emitter: commands.Command
): Promise<boolean> {
  const outputCollector = new OutputCollector()
  const nameRefiner = new NameRefiner(humanize(activity.actionName))
  const args: actions.Args = {
    SKIPPING: 254,
    configuration,
    file: activity.file,
    line: activity.line,
    linkTargets: targets,
    log: outputCollector.logFn(),
    name: nameRefiner.refineFn(),
    region: activity.region,
    document: activity.document,
  }
  try {
    const action = actionFinder.actionFor(activity)
    let actionResult: actions.Result
    if (action.length === 1) {
      actionResult = await runSyncOrPromiseFunc(action, args)
    } else {
      actionResult = await runCallbackFunc(action, args)
    }
    if (actionResult === undefined) {
      emitter.emit("result", {
        status: "success",
        activity,
        finalName: nameRefiner.finalName(),
        output: outputCollector.toString(),
      })
    } else if (actionResult === args.SKIPPING) {
      if (configuration.showSkipped) {
        emitter.emit("result", {
          status: "skipped",
          activity,
          finalName: nameRefiner.finalName(),
          output: outputCollector.toString(),
        })
      }
    } else {
      throw new Error(`unknown return code from action: ${actionResult}`)
    }
  } catch (e) {
    emitter.emit("result", {
      status: "failed",
      activity,
      finalName: nameRefiner.finalName(),
      error: new UserError(e.message, e.guidance || "", activity.file, activity.line),
      output: outputCollector.toString(),
    })
    return true
  }
  return false
}

async function runCallbackFunc(func: actions.Action, args: actions.Args): Promise<actions.Result> {
  const promisified = util.promisify<actions.Args, actions.Result>(func)
  return promisified(args)
}

async function runSyncOrPromiseFunc(func: actions.Action, args: actions.Args): Promise<actions.Result> {
  const result = await Promise.resolve(func(args))
  return result
}
