import * as color from "colorette"
import * as textRunner from "text-runner-core"

export function printSummary(results: textRunner.ActivityResults): void {
  let text = "\n"
  let colorFn: color.Color
  const errorCount = results.errorCount()
  if (errorCount === 0) {
    colorFn = color.green
    text += color.green("Success! ")
  } else {
    colorFn = color.red
    text += color.red(`${errorCount} errors, `)
  }
  text += colorFn(`${results.length} activities, ${results.duration}`)
  console.log(color.bold(text))
}
