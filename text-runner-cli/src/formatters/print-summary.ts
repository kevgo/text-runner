import * as color from "colorette"
import * as helpers from "../helpers"

export function printSummary(stats: helpers.Statistics): void {
  let text = "\n"
  let colorFn: color.Style
  if (stats.errorCount === 0) {
    colorFn = color.green
    text += color.green("Success! ")
  } else {
    colorFn = color.red
    text += color.red(`${stats.errorCount} errors, `)
  }
  text += colorFn(`${stats.activityCount} activities, ${stats.duration}`)
  console.log(color.bold(text))
}
