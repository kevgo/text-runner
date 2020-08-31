import * as color from "colorette"
import { StatsCounter } from "../../runners/helpers/stats-counter"

export function printSummary(stats: StatsCounter) {
  let text = "\n"
  let colorFn: color.Style
  if (stats.errors() === 0) {
    colorFn = color.green
    text += color.green("Success! ")
  } else {
    colorFn = color.red
    text += color.red(`${stats.errors()} errors, `)
  }
  text += colorFn(`${stats.activities()} activities in ${stats.files()} files, ${stats.duration()}`)
  console.log(color.bold(text))
}
