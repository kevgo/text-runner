import color from "colorette"
import path from "path"
import { UnprintedUserError } from "../errors/unprinted-user-error"
import { printCodeFrame } from "./print-code-frame"

/** prints the given error to the console */
export function printUserError(err: UnprintedUserError) {
  if (err.filePath && err.line != null) {
    console.log(
      color.red(`${err.filePath}:${err.line} -- ${err.message || ""}`)
    )
  } else {
    console.log(color.red(err.message))
  }
  const filePath = path.join(process.cwd(), err.filePath || "")
  printCodeFrame(console.log, filePath, err.line)
}
