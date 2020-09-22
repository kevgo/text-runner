import { ActivityList } from "../activities/index"
import * as configuration from "../configuration/index"
import { LinkTargetList } from "../link-targets/link-target-list"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"

export async function executeSequential(
  activities: ActivityList,
  actionFinder: ActionFinder,
  configuration: configuration.Data,
  linkTargets: LinkTargetList,
  emitter: EventEmitter
): Promise<void> {
  for (const activity of activities) {
    const abort = await runActivity(activity, actionFinder, configuration, linkTargets, emitter)
    if (abort) {
      return
    }
  }
}
