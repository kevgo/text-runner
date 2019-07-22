import color from "colorette"
import path from "path"
import { Activity } from "../activity-list/types/activity"
import { Configuration } from "../configuration/types/configuration"
import { printCodeFrame } from "../helpers/print-code-frame"
import { Formatter } from "./types/formatter"

/** A formatter that prints output and step names */
export class DetailedFormatter implements Formatter {
  /** the directory in which the sources are located */
  // TODO: replace with configuration
  private readonly configuration: Configuration

  // @ts-ignore: unused parameter
  constructor(stepCount: number, configuration: Configuration) {
    this.configuration = configuration
  }

  // @ts-ignore: unused stepName
  failed(activity: Activity, stepName: string, e: Error, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    process.stdout.write(
      color.red(`${activity.file.platformified()}:${activity.line} -- `)
    )
    console.log(e.message)
    const filePath = path.join(
      this.configuration.sourceDir,
      activity.file.platformified()
    )
    printCodeFrame(console.log, filePath, activity.line)
  }

  skipped(activity: Activity, stepName: string, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    console.log(
      color.cyan(
        `${activity.file.platformified()}:${
          activity.line
        } -- skipping: ${stepName}`
      )
    )
  }

  success(activity: Activity, stepName: string, output: string) {
    if (output !== "") {
      process.stdout.write(color.dim(output))
    }
    console.log(
      color.green(
        `${activity.file.platformified()}:${activity.line} -- ${stepName}`
      )
    )
  }
}
