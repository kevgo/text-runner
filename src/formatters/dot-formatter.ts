import color from "colorette"
import path from "path"
import { Activity } from "../activity-list/activity"
import { Configuration } from "../configuration/configuration"
import { printCodeFrame } from "../helpers/print-code-frame"
import { Formatter } from "./formatter"

/** A minimalistic formatter, prints dots for each check */
export class DotFormatter implements Formatter {
  /** the activity whose progess this formatter describes to the user */
  activity: Activity

  /** Text-Runner configuration */
  configuration: Configuration

  constructor(activity: Activity, configuration: Configuration) {
    this.activity = activity
    this.configuration = configuration
  }

  // @ts-ignore: okay to not use parameters here
  failed(stepName: string, err: Error, output: string) {
    console.log()
    console.log(color.dim(output))
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(err.message)
    printCodeFrame(
      console.log,
      path.join(
        this.configuration.sourceDir,
        this.activity.file.platformified()
      ),
      this.activity.line
    )
  }

  // @ts-ignore: okay to not use parameters here
  skipped(stepName: string, output: string) {
    process.stdout.write(color.cyan("."))
  }

  // @ts-ignore: okay to not use parameters here
  success(stepName: string, output: string) {
    process.stdout.write(color.green("."))
  }
}
