import { ActionArgs } from "../runners/action-args"

import chalk from "chalk"
import fs from "fs"
import jsdiffConsole from "jsdiff-console"
import path from "path"

export default function(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType("strong", "em")
  const expectedContent = args.nodes.textInNodeOfType("fence", "code")
  args.formatter.name(`verifying file ${chalk.cyan(filePath)}`)
  const fullPath = path.join(process.cwd(), filePath)
  args.formatter.log(`verify file ${fullPath}`)
  let actualContent
  try {
    actualContent = fs.readFileSync(fullPath, "utf8")
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`file ${chalk.red(filePath)} not found`)
    } else {
      throw err
    }
  }
  try {
    jsdiffConsole(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(
      `mismatching content in ${chalk.cyan(chalk.bold(filePath))}:\n${
        err.message
      }`
    )
  }
}
