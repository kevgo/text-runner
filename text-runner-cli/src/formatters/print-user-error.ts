import * as color from "colorette"
import * as path from "path"
import * as tr from "text-runner-core"

import * as helpers from "../helpers"

/** prints the given error to the console */
export function printUserError(err: tr.UserError): void {
  if (err.location) {
    console.log(color.red(`${err.location.file.unixified()}:${err.location.line} -- ${err.message || ""}`))
  } else {
    console.log(color.red(err.message))
  }
  if (err.guidance) {
    console.log()
    console.log(err.guidance)
  }
  const filePath = path.join(process.cwd(), err.location?.file?.platformified() || "")
  helpers.printCodeFrame(console.log, filePath, err.location?.line)
}
