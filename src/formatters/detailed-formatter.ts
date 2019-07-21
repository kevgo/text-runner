import color from "colorette"
import path from "path"
import { Activity } from "../activity-list/activity"
import { Configuration } from "../configuration/configuration"
import { printCodeFrame } from "../helpers/print-code-frame"
import { Formatter } from "./formatter"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  /** the activity whose progess this formatter describes to the user */
  activity: Activity

  /** the directory in which the sources are located */
  // TODO: replace with configuration
  configuration: Configuration

  constructor(activity: Activity, configuration: Configuration) {
    this.activity = activity
    this.configuration = configuration
  }

  // @ts-ignore: unused stepName
  failed(stepName: string, e: Error, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    process.stdout.write(
      color.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(e.message)
    const filePath = path.join(
      this.configuration.sourceDir,
      this.activity.file.platformified()
    )
    printCodeFrame(console.log, filePath, this.activity.line)
  }

  skipped(stepName: string, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    console.log(
      color.cyan(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- skipping: ${stepName}`
      )
    )
  }

  success(stepName: string, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    console.log(
      color.green(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${stepName}`
      )
    )
  }
}
