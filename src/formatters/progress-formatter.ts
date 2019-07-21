import color from "colorette"
import path from "path"
import { Activity } from "../activity-list/activity"
import { Configuration } from "../configuration/configuration"
import { printCodeFrame } from "../helpers/print-code-frame"
import { Formatter } from "./formatter"
import progress from "cli-progress"

export class ProgressFormatter implements Formatter {
  /** Text-Runner configuration */
  configuration: Configuration

  progressBar: any

  // @ts-ignore: ignore unused variable
  constructor(stepCount: number, configuration: Configuration) {
    this.configuration = configuration
    this.progressBar = new progress.Bar({}, progress.Presets.shades_classic)
    this.progressBar.start(stepCount, 0)
  }

  // @ts-ignore: okay to not use parameters here
  failed(activity: Activity, stepName: string, err: Error, output: string) {
    console.log()
    console.log()
    console.log(color.dim(output))
    process.stdout.write(
      color.red(`${activity.file.platformified()}:${activity.line} -- `)
    )
    console.log(err.message)
    printCodeFrame(
      console.log,
      path.join(this.configuration.sourceDir, activity.file.platformified()),
      activity.line
    )
  }

  // @ts-ignore: okay to not use parameters here
  skipped(activity: Activity, stepName: string, output: string) {
    process.stdout.write(color.cyan("."))
  }

  // @ts-ignore: okay to not use parameters here
  success(activity: Activity, stepName: string, output: string) {
    process.stdout.write(color.green("."))
  }
}
