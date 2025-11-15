import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

export function printSummary(results: textRunner.ActivityResults): void {
  let text = "\n"
  const errorCount = results.errorCount()
  if (errorCount === 0) {
    text += styleText("green", "Success! ")
    text += styleText("green", `${results.length} activities, ${results.duration}`)
  } else {
    text += styleText("red", `${errorCount} errors, `)
    text += styleText("red", `${results.length} activities, ${results.duration}`)
  }
  console.log(styleText("bold", text))
}
