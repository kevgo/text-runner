import * as color from "colorette"
import * as path from "path"
import { UserError } from "./user-error"
import { printCodeFrame } from "../helpers/print-code-frame"

/** prints the given error to the console */
export function printUserError(err: UserError) {
  if (err.file != null && err.line != null) {
    console.log(color.red(`${err.file}:${err.line} -- ${err.message || ""}`))
  } else {
    console.log(color.red(err.message))
  }
  if (err.guidance) {
    console.log()
    console.log(err.guidance)
  }
  const filePath = path.join(process.cwd(), err.file?.unixified() || "")
  printCodeFrame(console.log, filePath, err.line)
}
