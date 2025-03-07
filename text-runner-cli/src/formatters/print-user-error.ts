import * as color from "colorette"
import * as textRunner from "text-runner-engine"

import * as helpers from "../helpers/index.js"

/** prints the given error to the console */
export function printUserError(err: textRunner.UserError): void {
  if (err.location) {
    console.log(color.red(`${err.location.file.unixified()}:${err.location.line} -- ${err.message || ""}`))
  } else {
    console.log(color.red(err.message))
  }
  if (err.guidance) {
    console.log()
    console.log(err.guidance)
    console.log()
  }
  helpers.printCodeFrame(console.log, err.location)
}
