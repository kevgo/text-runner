import { ActionArgs } from "../runners/action-args"

import chalk from "chalk"
import fs from "fs"
import jsdiffConsole from "jsdiff-console"
import path from "path"

export default function(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType("strong", "em")
  const fullPath = path.join(process.cwd(), filePath)
  args.formatter.name(`verifying file ${chalk.cyan(filePath)}`)
  args.formatter.log(`verify file ${fullPath}`)
  const actualContent = readFile(fullPath)
  const expectedContent = args.nodes.textInNodeOfType("fence", "code")
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

function readFile(fullPath: string): string {
  try {
    return fs.readFileSync(fullPath, "utf8")
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`file ${chalk.red(fullPath)} not found`)
    } else {
      throw err
    }
  }
}
