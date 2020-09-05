import { ActivityList } from "../activity-list/types/activity-list"
import { Configuration } from "../configuration/types/configuration"
import { LinkTargetList } from "../link-targets/link-target-list"
import { StatsCounter } from "./helpers/stats-counter"
import { runActivity } from "./run-activity"
import { ActionFinder } from "../actions/action-finder"
import { EventEmitter } from "events"

export async function executeSequential(
  activities: ActivityList,
  actionFinder: ActionFinder,
  configuration: Configuration,
  linkTargets: LinkTargetList,
  statsCounter: StatsCounter,
  emitter: EventEmitter
): Promise<void> {
  for (const activity of activities) {
    const abort = await runActivity(activity, actionFinder, configuration, linkTargets, statsCounter, emitter)
    if (abort) {
      return
    }
  }
}
