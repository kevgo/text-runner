import * as assertNoDiff from 'assert-no-diff'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { ActionArgs } from '../runners/action-args'

export default async function verifyWorkspaceFileContent(args: ActionArgs) {
  const filePath = args.nodes.textInNodeOfType('strong', 'em')
  const fullPath = path.join(process.cwd(), filePath)
  args.formatter.name(`verifying file ${chalk.cyan(filePath)}`)
  args.formatter.log(`verify file ${fullPath}`)
  const actualContent = await readFile(filePath, fullPath)
  const expectedContent = args.nodes.textInNodeOfType('fence', 'code')
  try {
    assertNoDiff.trimmedLines(actualContent.trim(), expectedContent.trim())
  } catch (err) {
    throw new Error(
      `mismatching content in ${chalk.cyan(chalk.bold(filePath))}:\n${
        err.message
      }`
    )
  }
}

async function readFile(filePath: string, fullPath: string): Promise<string> {
  try {
    const result = await fs.readFile(fullPath, 'utf8')
    return result
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`file ${chalk.red(filePath)} not found`)
    } else {
      throw err
    }
  }
}
