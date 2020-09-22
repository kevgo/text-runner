import { ActivityList } from "../activities/types/activity-list"
import { Configuration } from "../configuration/configuration"
import { LinkTargetList } from "../link-targets/link-target-list"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"

export async function executeSequential(
  activities: ActivityList,
  actionFinder: ActionFinder,
  configuration: Configuration,
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
