import { styleText } from "node:util"
import * as textRunner from "text-runner-engine"

import * as helpers from "../helpers/index.js"

/** prints the given error to the console */
export function printUserError(err: textRunner.UserError): void {
  if (err.location) {
    console.log(styleText("red", `${err.location.file.unixified()}:${err.location.line} -- ${err.message || ""}`))
  } else {
    console.log(styleText("red", err.message))
  }
  if (err.guidance) {
    console.log()
    console.log(err.guidance)
    console.log()
  }
  helpers.printCodeFrame(console.log, err.location)
}
