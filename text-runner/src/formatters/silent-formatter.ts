import { Activity } from "../activity-list/types/activity"
import { Configuration } from "../configuration/types/configuration"
import { Formatter } from "./types/formatter"
import { StatsCounter } from "../runners/helpers/stats-counter"

/** A completely minimalistic formatter, prints nothing in the happy path */
export class SilentFormatter implements Formatter {
  // @ts-ignore: ignore unused variable
  constructor(stepCount: number, configuration: Configuration) {}

  // @ts-ignore: okay to not use parameters here
  failed(activity: Activity, stepName: string, err: Error, output: string) {}

  // @ts-ignore: okay to not use parameters here
  skipped(activity: Activity, stepName: string, output: string) {}

  // @ts-ignore: okay to not use parameters here
  success(activity: Activity, stepName: string, output: string) {}

  // @ts-ignore: okay to not use parameters here
  summary(stats: StatsCounter) {}
}
