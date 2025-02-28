import humanize from "humanize-string"
import * as util from "util"

import * as actions from "../actions/index.js"
import { Activity } from "../activities/index.js"
import * as commands from "../commands/index.js"
import * as configuration from "../configuration/index.js"
import { isUserError, UserError } from "../errors/user-error.js"
import * as linkTargets from "../link-targets/index.js"
import { errorMessage } from "../text-runner.js"
import { NameRefiner } from "./name-refiner.js"
import { OutputCollector } from "./output-collector.js"

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
    location: activity.location,
    linkTargets: targets,
    log: outputCollector.logFn(),
    name: nameRefiner.refineFn(),
    region: activity.region,
    document: activity.document
  }
  try {
    const action = await actionFinder.actionFor(activity)
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
        output: outputCollector.toString()
      })
    } else if (actionResult === args.SKIPPING) {
      if (configuration.showSkipped) {
        emitter.emit("result", {
          status: "skipped",
          activity,
          finalName: nameRefiner.finalName(),
          output: outputCollector.toString()
        })
      }
    } else {
      throw new Error(`unknown return code from action: ${actionResult}`)
    }
  } catch (e) {
    let guidance = ""
    if (isUserError(e)) {
      guidance = e.guidance
    }
    emitter.emit("result", {
      status: "failed",
      activity,
      finalName: nameRefiner.finalName(),
      error: new UserError(errorMessage(e), guidance, activity.location),
      output: outputCollector.toString()
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
